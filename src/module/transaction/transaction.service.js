// src/module/transaction/transaction.service.js
const Transaction = require('../models/transaction.model');
const Account = require('../models/account.model'); // Assuming you have an Account model

// Initiate Fund Transfer
exports.initiateTransactionService = async (userId, amount, toAccountNumber, description) => {
  try {
    // Check if the sender's account has enough balance
    const senderAccount = await Account.findOne({ userId, status: 'active' });
    const toAccount = await Account.findOne({ accountNumber: toAccountNumber, status: 'active' });

    if (!senderAccount || senderAccount.balance < amount) {
      throw new Error('Insufficient balance in your account');
    }

    if (!toAccount) {
      throw new Error('Recipient account not found');
    }

    // Debit from sender's account
    senderAccount.balance -= amount;
    await senderAccount.save();

    // Credit to the recipient's account
    toAccount.balance += amount;
    await toAccount.save();

    // Create a transaction record
    const transaction = new Transaction({
      fromAccount: senderAccount._id,
      toAccount: toAccount._id,
      amount,
      type: 'debit',
      status: 'success', // or 'pending' depending on your workflow
      description
    });
    await transaction.save();

    return {
      message: 'Fund transfer successful',
      transaction
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get Transaction History for User
exports.getTransactionHistoryService = async (userId) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { fromAccount: { userId } },
        { toAccount: { userId } }
      ]
    }).populate('fromAccount toAccount');
    
    return transactions;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get Specific Transaction by ID
exports.getTransactionByIdService = async (userId, transactionId) => {
  try {
    const transaction = await Transaction.findById(transactionId).populate('fromAccount toAccount');
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.fromAccount.userId.toString() !== userId && transaction.toAccount.userId.toString() !== userId) {
      throw new Error('You do not have permission to view this transaction');
    }

    return transaction;
  } catch (error) {
    throw new Error(error.message);
  }
};
