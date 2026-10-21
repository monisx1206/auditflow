const Inspection = require('../models/Inspection');
const Capa = require('../models/Capa');
const crud = require('./crud');

const populate = [{ path: 'site', select: 'name code' }, { path: 'inspector', select: 'name' }];
exports.base = crud(Inspection, { populate, filters: ['site', 'status', 'area'], sort: '-date' });

// An exceedance is a compliance event: auto-raise a CAPA so it cannot be forgotten
exports.create = async (req, res, next) => {
  try {
    const insp = await Inspection.create({ ...req.body, inspector: req.body.inspector || req.user._id, createdBy: req.user._id });
    const bad = insp.readings.filter(r => r.exceeded);
    if (bad.length) {
      await Capa.create({
        title: `Limit exceeded at ${insp.area}: ${bad.map(r => r.parameter).join(', ')}`,
        description: bad.map(r => `${r.parameter} = ${r.value}${r.unit ? ' ' + r.unit : ''} (allowed ${r.limitMin ?? '-'} to ${r.limitMax ?? '-'})`).join('\n'),
        site: insp.site, source: 'inspection', sourceRef: insp._id,
        severity: 'major', dueDate: new Date(Date.now() + 15 * 864e5), createdBy: req.user._id,
        history: [{ by: req.user._id, action: 'created', note: 'Auto-raised: reading exceeded permissible limit' }],
      });
    }
    res.status(201).json({ inspection: await insp.populate(populate), capasRaised: bad.length ? 1 : 0 });
  } catch (e) { next(e); }
};
