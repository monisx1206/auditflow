const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  industry: { type: String, default: 'Manufacturing' },
  location: String,
  consentValidTill: Date,                       // pollution-control consent / permit expiry
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Site', siteSchema);
