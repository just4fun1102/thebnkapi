const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

const userSchema = new mongoose.Schema (
  {
    name: String,
    gender: String,
    email: String,
    phoneNumber: String,
    dateOfBirth: Date,
    password: String,
    accountType: String,
    currencyType: String,
    country: String,
    state: String,
    homeAddress: String,
    accountNumber: Number, // Unique account number
    accountBalance: Number,
    isAdmin: Boolean, // Field to indicate admin status
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model ('User', userSchema);
