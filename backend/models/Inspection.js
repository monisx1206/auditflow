const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  parameter: { type: String, required: true },  // PM10, pH, BOD, Noise...
  value: { type: Number, required: true },
  unit: String,
  limitMax: Number,
  limitMin: Number,
  exceeded: { type: Boolean, default: false },  // computed automatically
});

const inspectionSchema = new mongoose.Schema({
  site: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  area: { type: String, required: true },       // ETP outlet, Stack-2, Waste yard...
  date: { type: Date, default: Date.now },
  readings: [readingSchema],
  notes: String,
  status: { type: String, enum: ['ok', 'exceedance'], default: 'ok' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

inspectionSchema.pre('save', function (next) {
  this.readings.forEach(r => {
    r.exceeded = (r.limitMax != null && r.value > r.limitMax) || (r.limitMin != null && r.value < r.limitMin);
  });
  this.status = this.readings.some(r => r.exceeded) ? 'exceedance' : 'ok';
  next();
});

inspectionSchema.index({ site: 1, date: -1 });
module.exports = mongoose.model('Inspection', inspectionSchema);
