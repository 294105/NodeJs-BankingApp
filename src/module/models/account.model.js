const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  accountNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ['savings', 'current'], default: 'savings' },
  balance: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'active', 'rejected'], default: 'pending' },
  name: String,
  mobile: String,
  address: String,
  dob: Date,
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin ID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', accountSchema);
