const Complaint = require('../models/Complaint');

exports.submitComplaint = async (req, res) => {
  try {
    const { category, location, message, phone } = req.body;
    const photos = req.files?.map((file) => file.filename);

    const complaint = new Complaint({
      category,
      location,
      message,
      phone,
      photoUrls: photos,
    });

    await complaint.save();

    res.status(201).json({ message: "تم إرسال الشكوى بنجاح." });
  } catch (err) {
    res.status(500).json({ error: "فشل في إرسال الشكوى" });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: { $ne: "hidden" } }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getHiddenComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: "hidden" }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'in-progress', 'resolved', 'ignored', 'hidden'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Could not update status' });
  }
};
