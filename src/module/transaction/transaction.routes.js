// src/module/transaction/transaction.routes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../../middlewares/verifyToken');
const {
  initiateFundTransfer,
  getTransactionHistory,
  getTransactionById
} = require('./transaction.controller');

// Initiate Fund Transfer (POST)
router.post('/transfer', verifyToken, initiateFundTransfer);

// Get Transaction History (GET)
router.get('/history', verifyToken, getTransactionHistory);

// Get Specific Transaction (GET)
router.get('/:transactionId', verifyToken, getTransactionById);

module.exports = router;
