// src/module/admin/admin.service.js
const Account = require('../models/account.model');

exports.approveAccountService = async (accountNumber, adminId) => {
  if (!accountNumber) {
    throw new Error('Account number is required');
  }

  const account = await Account.findOne({ accountNumber });

  if (!account) {
    throw new Error('Account not found');
  }

  if (account.status === 'active') {
    throw new Error('Account is already active');
  }

  account.status = 'active';
  account.isApproved = true;
  account.approvedBy = adminId;

  await account.save();

  return {
    message: 'Account approved successfully',
    account,
  };
};