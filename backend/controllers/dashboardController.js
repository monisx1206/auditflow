const Audit = require('../models/Audit');
const Inspection = require('../models/Inspection');
const Capa = require('../models/Capa');
const Report = require('../models/Report');
const Site = require('../models/Site');

exports.summary = async (req, res, next) => {
  try {
    const now = new Date();
    const in60 = new Date(Date.now() + 60 * 864e5);
    const yearAgo = new Date(Date.now() - 365 * 864e5);

    const [capaByStatus, auditByStatus, dueCapas, dueReports, exceedTrend, siteScores, consents] = await Promise.all([
      Capa.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Audit.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Capa.find({ status: { $ne: 'closed' }, dueDate: { $lte: in60 } }).populate('site', 'code').select('code title dueDate severity site status').sort('dueDate'),
      Report.find({ status: { $in: ['draft', 'in_review'] }, dueDate: { $lte: in60 } }).populate('site', 'code').select('title type dueDate site status').sort('dueDate'),
      Inspection.aggregate([
        { $match: { date: { $gte: yearAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$date' } }, inspections: { $sum: 1 },
            exceedances: { $sum: { $cond: [{ $eq: ['$status', 'exceedance'] }, 1, 0] } } } },
        { $sort: { _id: 1 } },
      ]),
      Audit.aggregate([
        { $match: { status: 'completed', score: { $ne: null } } },
        { $group: { _id: '$site', avgScore: { $avg: '$score' }, audits: { $sum: 1 } } },
        { $lookup: { from: 'sites', localField: '_id', foreignField: '_id', as: 'site' } },
        { $unwind: '$site' },
        { $project: { _id: 0, site: '$site.name', code: '$site.code', avgScore: { $round: ['$avgScore', 0] }, audits: 1 } },
      ]),
      Site.find({ consentValidTill: { $lte: in60 } }).select('name code consentValidTill'),
    ]);

    const toMap = (arr) => Object.fromEntries(arr.map(x => [x._id, x.count]));
    res.json({
      capaByStatus: toMap(capaByStatus),
      auditByStatus: toMap(auditByStatus),
      overdueCount: dueCapas.filter(c => new Date(c.dueDate) < now).length,
      deadlines: { capas: dueCapas, reports: dueReports, consents },
      exceedTrend: exceedTrend.map(x => ({ month: x._id, inspections: x.inspections, exceedances: x.exceedances })),
      siteScores,
    });
  } catch (e) { next(e); }
};
