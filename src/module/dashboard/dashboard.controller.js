const { getUserByIdService, getAccountSummaryService, getRecentTransactionsService } = require('./dashboard.service');

exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;
  const user = await getUserByIdService(userId);
  res.json({ user });
};

exports.getAccountSummary = async (req, res) => {
  const userId = req.user.id;
  const summary = await getAccountSummaryService(userId);
  res.json({ summary });
};

exports.getRecentTransactions = async (req, res) => {
  const userId = req.user.id;
  const transactions = await getRecentTransactionsService(userId);
  res.json({ transactions });
};
