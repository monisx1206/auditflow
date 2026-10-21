const Capa = require('../models/Capa');
const crud = require('./crud');

const populate = [{ path: 'site', select: 'name code' }, { path: 'assignedTo', select: 'name' }];
exports.base = crud(Capa, { populate, filters: ['site', 'status', 'severity', 'assignedTo'], sort: 'dueDate' });

// Workflow: open -> in_progress -> pending_verification -> closed. Only auditors/admins verify & close.
const NEXT = {
  open: ['in_progress'],
  in_progress: ['pending_verification'],
  pending_verification: ['closed', 'in_progress'],
  overdue: ['in_progress'],
  closed: [],
};

exports.update = async (req, res, next) => {
  try {
    const capa = await Capa.findById(req.params.id);
    if (!capa) return res.status(404).json({ message: 'Not found' });
    const { status, note, ...fields } = req.body;
    delete fields.code; delete fields.history; delete fields.evidence;

    if (status && status !== capa.status) {
      if (!NEXT[capa.status].includes(status)) return res.status(400).json({ message: `Cannot move from ${capa.status} to ${status}` });
      if (status === 'closed') {
        if (req.user.role === 'site_manager') return res.status(403).json({ message: 'Only an auditor can verify and close a CAPA' });
        if (!(fields.correctiveAction || capa.correctiveAction)) return res.status(400).json({ message: 'Record the corrective action before closing' });
        capa.closedAt = new Date();
      }
      capa.history.push({ by: req.user._id, action: `status: ${capa.status} → ${status}`, note });
      capa.status = status;
    }
    capa.set(fields);
    await capa.save();
    res.json(await capa.populate(populate));
  } catch (e) { next(e); }
};

exports.addEvidence = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const capa = await Capa.findById(req.params.id);
    if (!capa) return res.status(404).json({ message: 'Not found' });
    capa.evidence.push({ filename: req.file.originalname, path: `/uploads/${req.file.filename}` });
    capa.history.push({ by: req.user._id, action: 'evidence added', note: req.file.originalname });
    await capa.save();
    res.json(await capa.populate(populate));
  } catch (e) { next(e); }
};
