const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  category: { type: String, required: true },
  location: { type: String, required: true },
  message: { type: String, required: true },
  phone: { type: String },
  photoUrls: [{ type: String }], 
  status: {
    type: String,
    enum: ["new", "in-progress", "resolved", "ignored", "hidden"],
    default: "new",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);
