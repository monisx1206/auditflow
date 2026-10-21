const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  at: { type: Date, default: Date.now },
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  note: String,
}, { _id: false });

const capaSchema = new mongoose.Schema({
  code: { type: String, unique: true },         // CAPA-2026-0001
  title: { type: String, required: true },
  description: String,
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  source: { type: String, enum: ['audit', 'inspection', 'manual'], default: 'manual' },
  sourceRef: { type: mongoose.Schema.Types.ObjectId },
  severity: { type: String, enum: ['minor', 'major', 'critical'], default: 'minor' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'pending_verification', 'closed', 'overdue'], default: 'open' },
  rootCause: String,
  correctiveAction: String,
  preventiveAction: String,
  evidence: [{ filename: String, path: String, uploadedAt: { type: Date, default: Date.now } }],
  closedAt: Date,
  history: [historySchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

capaSchema.pre('save', async function (next) {
  if (this.code) return next();
  const year = new Date().getFullYear();
  const last = await this.constructor.findOne({ code: new RegExp(`^CAPA-${year}-`) }).sort({ code: -1 }).select('code');
  let nextNum = 1;
  if (last && last.code) {
    const parts = last.code.split('-');
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastNum)) {
      nextNum = lastNum + 1;
    }
  }
  this.code = `CAPA-${year}-${String(nextNum).padStart(4, '0')}`;
  next();
});

capaSchema.index({ status: 1, dueDate: 1 });
capaSchema.index({ site: 1, createdAt: -1 });
module.exports = mongoose.model('Capa', capaSchema);
