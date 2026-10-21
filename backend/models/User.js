const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  // admin: everything | auditor: audits/inspections/reports/verify CAPA | site_manager: works CAPAs
  role: { type: String, enum: ['admin', 'auditor', 'site_manager'], default: 'auditor' },
  sites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matches = function (plain) { return bcrypt.compare(plain, this.password); };

module.exports = mongoose.model('User', userSchema);
