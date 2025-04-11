const { registerUserWithAccountService, loginUserService } = require('./auth.service');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const { user, account } = await registerUserWithAccountService({ name, email, password, mobile });

    return res.status(201).json({
      message: 'User registered and account created successfully',
      user: { id: user._id, email: user.email },
      account: { id: account._id, accountNumber: account.accountNumber, status: account.status }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user, message } = await loginUserService(email, password);

    if (!token || !user) {
      const errorMessage = message || 'Invalid credentials';
      const isLocked = user && user.isLocked;
      return res.status(401).json({
        message: isLocked ? 'Account is locked. Please reset your password.' : errorMessage
      });
    }

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isLocked: user.isLocked
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




//Forgot Password




exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is: ${otp}`
    });

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


//Reset Password

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    user.isLocked = false;
    user.failedLoginAttempts = 0;

    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
