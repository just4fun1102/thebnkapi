const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
},{
    timestamps: true,
  });

// Hash the password before saving it
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 10); // Hash the password with a salt factor of 10
  this.password = hash;
  next();
});

module.exports = mongoose.model('User', userSchema);
