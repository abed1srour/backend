const express = require('express');
const router = express.Router();

const {
  submitComplaint,
  getAllComplaints,
  updateStatus,
  getHiddenComplaints
} = require('../controllers/complaintController');

const upload = require('../middleware/upload');

router.post('/', upload.array('photos', 10), submitComplaint); 
router.get('/', getAllComplaints);
router.put('/:id/status', updateStatus);
router.get('/hidden', getHiddenComplaints);

module.exports = router;
