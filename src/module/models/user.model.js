// src/module/auth/auth.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  password: String,
  role:{type: String, enum: ['user', 'admin'], default: 'user'},
  isLocked: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  otp: String,
  otpExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
