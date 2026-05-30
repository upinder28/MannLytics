const mongoose = require("mongoose");

const MoodCheckinSchema = new mongoose.Schema({
  emoji: { type: String, required: true },
  label: { type: String, required: true },
  userEmail: { type: String, default: "anonymous" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MoodCheckin", MoodCheckinSchema);