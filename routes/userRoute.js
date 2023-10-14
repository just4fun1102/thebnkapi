const express = require ('express');
const User = require ('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyToken'); // Import the verifyToken function
const router = express.Router ();

async function generateRandomUniqueAccountNumber () {
  const min = 1000000000; // Smallest 10-digit number
  const max = 9999999999; // Largest 10-digit number

  let isUnique = false;
  let accountNumber;

  while (!isUnique) {
    accountNumber = Math.floor (Math.random () * (max - min + 1)) + min;
    // Check if the generated number already exists in the database
    const userWithSameAccountNumber = await User.findOne ({accountNumber});

    if (!userWithSameAccountNumber) {
      isUnique = true;
    }
  }

  return accountNumber; // Return the unique account number
}

router.post ('/register', async (req, res) => {
  const userData = req.body;

  // Check if the accountNumber is already taken
  const existingUser = await User.findOne ({
    accountNumber: userData.accountNumber,
  });
  if (existingUser) {
    return res.status (400).json ({error: 'accountNumber already taken'});
  }

  // Generate a unique account number
  const accountNumber = await generateRandomUniqueAccountNumber ();

  const newUser = new User ({
    ...userData,
    accountNumber,
  });

  try {
    await newUser.save ();
    res.status (201).json ({message: 'User registered successfully'});
  } catch (err) {
    res.status (400).json ({error: err.message});
  }
});

// User Login
router.post ('/login', async (req, res) => {
  try {
    const {loginIdentifier, password} = req.body;

    // Check if the loginIdentifier is an email or account number
    const isEmail = loginIdentifier.includes ('@');
    const query = isEmail
      ? {email: loginIdentifier}
      : {accountNumber: parseInt (loginIdentifier)};

    // Find the user by email or accountNumber
    const user = await User.findOne (query);

    // If the user does not exist
    if (!user) {
      return res
        .status (401)
        .json ({message: 'Authentication failed: User not found'});
    }

    // Compare the hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare (password, user.password);

    if (!isPasswordValid) {
      return res
        .status (401)
        .json ({message: 'Authentication failed: Incorrect password'});
    }

    // Generate a JWT token upon successful login
    const token = jwt.sign ({userId: user._id}, process.env.secret_key, {
      expiresIn: '1h',
    }); // Replace 'your-secret-key' with your own secret

    return res.status (200).json ({token, user, message: 'Login successful'});
  } catch (error) {
    console.error ('User login error:', error);
    return res.status (500).json ({message: 'Internal server error'});
  }
});

// Add this route to your userRoute.js or another appropriate location
router.get('/', verifyToken, async (req, res) => {
  try {
    // Fetch the user's data based on req.userId (which is extracted from the token)
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
