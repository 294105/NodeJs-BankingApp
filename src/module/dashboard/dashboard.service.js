const User = require('../auth/auth.model');
const Account = require('../models/account.model');
const Transaction = require('../models/transaction.model');

exports.getUserByIdService = async (userId) => {
  return await User.findById(userId).select('-password -otp -otpExpiry');
};

exports.getAccountSummaryService = async (userId) => {
  return await Account.findOne({ userId });
};

exports.getRecentTransactionsService = async (userId) => {
  return await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(5);
};
