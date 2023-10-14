const User = require('../models/user'); // Import the User model

async function generateRandomUniqueAccountNumber() {
  const min = 1000000000; // Smallest 10-digit number
  const max = 9999999999; // Largest 10-digit number

  let isUnique = false;
  let accountNumber;

  while (!isUnique) {
    accountNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    // Check if the generated number already exists in the database
    const userWithSameAccountNumber = await User.findOne({ accountNumber });

    if (!userWithSameAccountNumber) {
      isUnique = true;
    }
  }

  return accountNumber; // Return the unique account number
}

module.exports = generateRandomUniqueAccountNumber;
