const { approveAccountService } = require('./admin.service');

exports.approveAccount = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { accountId } = req.params;

    const result = await approveAccountService(accountId, adminId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: 'Approval failed', error: error.message });
  }
};
