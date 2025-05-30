const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  submitComplaint,
  getAllComplaints,
  updateStatus,
  getHiddenComplaints
} = require('../controllers/complaintController');
router.post('/', upload.array('photos', 10), submitComplaint);
router.get('/', getAllComplaints);
router.put('/:id/status', updateStatus);
router.get('/hidden', getHiddenComplaints);
router.get('/test', (req, res) => {
  res.json({ message: 'Complaint route is active' });
});


module.exports = router;
