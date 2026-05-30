const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema({
  userId: String,
  text: String,
  analysis: Object,
  riskScore: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Journal", JournalSchema);

