const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  provider: String,
  wallet_address: String,
  verification_status: {
    type: String,
    enum: ['pending', 'verified'],
    default: 'pending'
  }
});

module.exports = mongoose.model('User', userSchema);
