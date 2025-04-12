const express = require('express');
const app = express();
const authRoutes = require('./module/auth/auth.routes');
const dashboardRoutes = require('./module/dashboard/dashboard.routes');
const adminRoutes = require('./module/admin/admin.routes');
const transactionRoutes = require('./module/transaction/transaction.routes');

require('dotenv').config();


app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.use('/api/transactions', transactionRoutes);

// src/app.js
app.use('/api/admin', adminRoutes);




module.exports = app;
