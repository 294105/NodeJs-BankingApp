// src/module/transaction/transaction.controller.js
const { 
    initiateTransactionService, 
    getTransactionHistoryService, 
    getTransactionByIdService 
  } = require('./transaction.service');
  
  // Initiate Fund Transfer
  exports.initiateFundTransfer = async (req, res) => {
    try {
      const { amount, toAccountNumber, description } = req.body;
      const userId = req.user.id; // Get user ID from JWT token
  
      const result = await initiateTransactionService(userId, amount, toAccountNumber, description);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: 'Transaction failed', error: error.message });
    }
  };
  
  // Get Transaction History
  exports.getTransactionHistory = async (req, res) => {
    try {
      const userId = req.user.id;
      const history = await getTransactionHistoryService(userId);
      res.status(200).json(history);
    } catch (error) {
      res.status(400).json({ message: 'Failed to fetch transaction history', error: error.message });
    }
  };
  
  // Get Transaction by ID
  exports.getTransactionById = async (req, res) => {
    try {
      const { transactionId } = req.params;
      const userId = req.user.id;
      const transaction = await getTransactionByIdService(userId, transactionId);
      res.status(200).json(transaction);
    } catch (error) {
      res.status(400).json({ message: 'Failed to fetch transaction', error: error.message });
    }
  };
  