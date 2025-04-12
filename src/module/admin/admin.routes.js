const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const verifyToken = require('../../middlewares/verifyToken');
const isAdmin = require('../../middlewares/isAdmin');

router.put('/accounts/:accountNumber/approve', verifyToken, isAdmin, adminController.approveAccount);
// src/module/admin/admin.routes.js


module.exports = router;
