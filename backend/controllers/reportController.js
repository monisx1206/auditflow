const Report = require('../models/Report');
const Audit = require('../models/Audit');
const Inspection = require('../models/Inspection');
const Capa = require('../models/Capa');
const crud = require('./crud');

const populate = [{ path: 'site', select: 'name code' }];
exports.base = crud(Report, { populate, filters: ['site', 'status', 'type'], sort: 'dueDate' });

// Fill the statutory summary from real records in the reporting period
exports.generate = async (req, res, next) => {
  try {
    const r = await Report.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    if (!r.periodStart || !r.periodEnd) return res.status(400).json({ message: 'Set the reporting period first' });
    const range = { $gte: r.periodStart, $lte: r.periodEnd };

    const [audits, inspections, capasOpened, capasClosed] = await Promise.all([
      Audit.find({ site: r.site, status: 'completed', completedDate: range }),
      Inspection.find({ site: r.site, date: range }),
      Capa.countDocuments({ site: r.site, createdAt: range }),
      Capa.countDocuments({ site: r.site, closedAt: range }),
    ]);
    const scores = audits.map(a => a.score).filter(s => s != null);
    r.summary = {
      audits: audits.length,
      inspections: inspections.length,
      exceedances: inspections.filter(i => i.status === 'exceedance').length,
      capasOpened, capasClosed,
      avgAuditScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    };
    if (r.status === 'draft') r.status = 'in_review';
    await r.save();
    res.json(await r.populate(populate));
  } catch (e) { next(e); }
};

exports.submit = async (req, res, next) => {
  try {
    const r = await Report.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    if (r.summary?.audits == null) return res.status(400).json({ message: 'Generate the summary before submitting' });
    r.status = 'submitted';
    r.submittedAt = new Date();
    r.referenceNo = req.body.referenceNo || r.referenceNo;
    await r.save();
    res.json(await r.populate(populate));
  } catch (e) { next(e); }
};

exports.exportCsv = async (req, res, next) => {
  try {
    const rows = await Report.find().populate('site', 'name').sort('dueDate');
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const head = ['Type', 'Site', 'Authority', 'Due date', 'Status', 'Reference', 'Audits', 'Inspections', 'Exceedances'];
    const lines = rows.map(r => [r.type, r.site?.name, r.authority, r.dueDate?.toISOString().slice(0, 10), r.status, r.referenceNo,
      r.summary?.audits, r.summary?.inspections, r.summary?.exceedances].map(esc).join(','));
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="statutory-reports.csv"');
    res.send([head.join(','), ...lines].join('\n'));
  } catch (e) { next(e); }
};
