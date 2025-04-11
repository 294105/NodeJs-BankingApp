const Account = require('../models/account.model');

exports.approveAccountService = async (accountId, adminId) => {
  const account = await Account.findById(accountId);

  if (!account) throw new Error('Account not found');
  if (account.status !== 'pending') throw new Error('Account already processed');

  account.status = 'active';
  account.isApproved = true;
  account.approvedBy = adminId;

  await account.save();

  return { success: true, message: 'Account approved successfully', account };
};
