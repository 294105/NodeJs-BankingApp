const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Account = require('../models/account.model');

function generateAccountNumber() {
  return 'AC' + Math.floor(1000000000 + Math.random() * 9000000000);
}

exports.registerUserWithAccountService = async ({ name, email, password, mobile }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    mobile,
    password: hashedPassword,
    role: 'user'
  });

  const savedUser = await newUser.save();

  const account = new Account({
    userId: savedUser._id,
    accountNumber: generateAccountNumber(),
    status: 'pending',
    balance: 0
  });

  const savedAccount = await account.save();

  return { user: savedUser, account: savedAccount };
};

exports.loginUserService = async (identifier, password) => {
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check if account is locked
    if (user.isLocked) {
      return { success: false, message: 'Account is locked. Please reset your password.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.failedLoginAttempts += 1;

      // Lock the account if 3 failed attempts
      if (user.failedLoginAttempts >= 3) {
        user.isLocked = true;

      }

      await user.save();
      console.log('Login attempts:', user.failedLoginAttempts);
      if(user.failedLoginAttempts >= 3){
        return { success: false, message: 'Account is locked. Please reset your password.' };
      
      }

      return { success: false, message: 'Invalid *** credentials' };
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.isLocked = false;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }
    };

  } catch (err) {
    console.error(err);
    return { success: false, message: 'Server error', error: err.message };
  }
};
