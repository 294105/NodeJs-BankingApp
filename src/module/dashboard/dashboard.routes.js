const express = require('express');
const router = express.Router();
const verifyToken = require('../../middlewares/verifyToken');
const {
  getUserProfile,
  getAccountSummary,
  getRecentTransactions
} = require('./dashboard.controller');

router.get('/profile', verifyToken, getUserProfile);
router.get('/summary', verifyToken, getAccountSummary);
router.get('/transactions', verifyToken, getRecentTransactions);

module.exports = router;
