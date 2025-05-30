const BlockedUser = require('../models/BlockedUser');

exports.checkBlocked = async (req, res, next) => {
  const { phone } = req.body;
  const ip = req.ip;

  const isBlocked = await BlockedUser.findOne({
    $or: [{ phone }, { ip }]
  });

  if (isBlocked) {
    return res.status(403).json({ message: 'You are blocked from submitting complaints.' });
  }

  next();
};

exports.blockUser = async (req, res) => {
  const { phone, ip, reason } = req.body;

  const block = new BlockedUser({ phone, ip, reason });
  await block.save();

  res.status(201).json({ message: 'User blocked successfully.' });
};
exports.checkBlocked = async (req, res, next) => {
  const phone = req.body?.phone || null;
  const ip = req.ip;

  const BlockedUser = require('../models/BlockedUser');

  const isBlocked = await BlockedUser.findOne({
    $or: [
      phone ? { phone } : null,
      ip ? { ip } : null
    ].filter(Boolean)
  });

  if (isBlocked) {
    return res.status(403).json({ message: 'You are blocked from submitting complaints.' });
  }

  next();
};


exports.unblockUser = async (req, res) => {
  const { phone, ip } = req.body;

  if (!phone && !ip) {
    return res.status(400).json({ error: 'Please provide a phone number or IP to unblock.' });
  }

  const result = await BlockedUser.deleteMany({
    $or: [
      phone ? { phone } : null,
      ip ? { ip } : null
    ].filter(Boolean)
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'No matching blocked user found.' });
  }

  res.json({ message: 'User unblocked successfully.' });
};
