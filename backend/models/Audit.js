const mongoose = require('mongoose');

const checklistItem = new mongoose.Schema({
  clause: String,                               // e.g. "Air"
  question: { type: String, required: true },
  compliant: { type: Boolean, default: null },  // null = not assessed yet
  severity: { type: String, enum: ['minor', 'major', 'critical'], default: 'minor' },
  remarks: String,
});

const auditSchema = new mongoose.Schema({
  title: { type: String, required: true },
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  type: { type: String, enum: ['internal', 'external', 'regulatory'], default: 'internal' },
  auditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledDate: { type: Date, required: true },
  completedDate: Date,
  status: { type: String, enum: ['planned', 'in_progress', 'completed'], default: 'planned' },
  checklist: [checklistItem],
  score: { type: Number, default: null },       // % of assessed items that are compliant
  capasRaised: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

auditSchema.methods.computeScore = function () {
  const assessed = this.checklist.filter(c => c.compliant !== null);
  if (!assessed.length) return null;
  return Math.round((assessed.filter(c => c.compliant).length / assessed.length) * 100);
};

auditSchema.index({ site: 1, scheduledDate: -1 });
module.exports = mongoose.model('Audit', auditSchema);
