const Audit = require('../models/Audit');
const Capa = require('../models/Capa');
const crud = require('./crud');

const populate = [{ path: 'site', select: 'name code' }, { path: 'auditor', select: 'name' }];
exports.base = crud(Audit, { populate, filters: ['site', 'status', 'type'], sort: '-scheduledDate' });

const DUE_DAYS = { critical: 7, major: 30, minor: 60 };

exports.saveChecklist = async (req, res, next) => {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit) return res.status(404).json({ message: 'Not found' });
    if (audit.status === 'completed') return res.status(400).json({ message: 'Completed audits are locked' });
    audit.checklist = req.body.checklist;
    audit.status = 'in_progress';
    audit.score = audit.computeScore();
    await audit.save();
    res.json(await audit.populate(populate));
  } catch (e) { next(e); }
};

// Complete => lock, score, and raise a CAPA for every non-compliance
exports.complete = async (req, res, next) => {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit) return res.status(404).json({ message: 'Not found' });
    if (audit.status === 'completed') return res.status(400).json({ message: 'Already completed' });
    if (!audit.checklist.length) return res.status(400).json({ message: 'Add checklist items first' });
    if (audit.checklist.some(c => c.compliant === null)) return res.status(400).json({ message: 'Assess every checklist item before completing' });

    audit.status = 'completed';
    audit.completedDate = new Date();
    audit.score = audit.computeScore();

    const failed = audit.checklist.filter(c => c.compliant === false);
    for (const item of failed) {
      await Capa.create({
        title: `${item.clause ? item.clause + ': ' : ''}${item.question}`.slice(0, 140),
        description: item.remarks,
        site: audit.site, source: 'audit', sourceRef: audit._id,
        severity: item.severity,
        dueDate: new Date(Date.now() + DUE_DAYS[item.severity] * 864e5),
        createdBy: req.user._id,
        history: [{ by: req.user._id, action: 'created', note: `Raised from audit "${audit.title}"` }],
      });
    }
    audit.capasRaised = failed.length > 0;
    await audit.save();
    res.json({ audit: await audit.populate(populate), capasRaised: failed.length });
  } catch (e) { next(e); }
};
