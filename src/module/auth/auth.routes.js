const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
//const { verifyToken } = require('../../middlewares/auth.middleware');
const verifyToken = require('../../middlewares/verifyToken');
// src/module/auth/auth.routes.js
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


// Register + open account
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);


router.get('/test-protected', verifyToken, (req, res) => {
    res.json({
        message: 'Access granted to protected route',
        user: req.user
    });
});
module.exports = router;
