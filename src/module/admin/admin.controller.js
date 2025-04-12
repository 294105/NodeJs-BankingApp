// src/module/admin/admin.controller.js
const { approveAccountService } = require('./admin.service');

exports.approveAccount = async (req, res) => {
  try {
    const adminId = req.user.id;
    const accountNumber = req.params.accountNumber; // ✅ FIX: Avoid destructuring here
    console.log('Account number:', accountNumber);

    const result = await approveAccountService(accountNumber, adminId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: 'Approval failed', error: error.message });
  }
};