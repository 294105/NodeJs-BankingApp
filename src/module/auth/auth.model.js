const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isLocked: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  otp: String,
  otpExpiry: Date
}, { timestamps: true });

// Avoid OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
