const mongoose = require('mongoose');

const blockedUserSchema = new mongoose.Schema({
  phone: { type: String },
  ip: { type: String },
  reason: { type: String },
  blockedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BlockedUser', blockedUserSchema);
