// Factory: every resource gets list / get / create / update / remove
module.exports = (Model, { populate = [], filters = [], sort = '-createdAt' } = {}) => ({
  list: async (req, res, next) => {
    try {
      const q = {};
      filters.forEach(f => { if (req.query[f]) q[f] = req.query[f]; });
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.min(parseInt(req.query.limit) || 50, 200);
      const [items, total] = await Promise.all([
        Model.find(q).populate(populate).sort(sort).skip((page - 1) * limit).limit(limit),
        Model.countDocuments(q),
      ]);
      res.json({ items, total, page, pages: Math.ceil(total / limit) });
    } catch (e) { next(e); }
  },
  get: async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id).populate(populate);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    } catch (e) { next(e); }
  },
  create: async (req, res, next) => {
    try {
      const doc = await Model.create({ ...req.body, createdBy: req.user._id });
      res.status(201).json(await doc.populate(populate));
    } catch (e) { next(e); }
  },
  update: async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      doc.set(req.body);
      await doc.save();                         // save() so pre-save hooks run
      res.json(await doc.populate(populate));
    } catch (e) { next(e); }
  },
  remove: async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (e) { next(e); }
  },
});
