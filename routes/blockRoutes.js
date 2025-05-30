const express = require('express');
const router = express.Router();
const blockController = require('../controllers/blockController');

router.post('/block', blockController.blockUser);
router.post('/unblock', blockController.unblockUser);

module.exports = router;
