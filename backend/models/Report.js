const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String, required: true,
    enum: ['annual_environmental_statement', 'half_yearly_compliance', 'hazardous_waste_return', 'consent_renewal', 'water_cess_return', 'other'],
  },
  title: String,
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  authority: { type: String, default: 'Tamil Nadu Pollution Control Board (TNPCB)' },
  periodStart: Date,
  periodEnd: Date,
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['draft', 'in_review', 'submitted', 'acknowledged'], default: 'draft' },
  submittedAt: Date,
  referenceNo: String,                          // filing / acknowledgement number
  summary: {                                    // snapshot built by /reports/:id/generate
    audits: Number, inspections: Number, exceedances: Number,
    capasOpened: Number, capasClosed: Number, avgAuditScore: Number,
  },
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

reportSchema.index({ status: 1, dueDate: 1 });
module.exports = mongoose.model('Report', reportSchema);
