const express = require("express");
const router = express.Router();
const MoodCheckin = require("../models/MoodCheckin");

// POST /api/mood-checkin — save a mood check-in
router.post("/", async (req, res) => {
  try {
    const { emoji, label, userEmail } = req.body;
    if (!emoji || !label) {
      return res.status(400).json({ message: "emoji and label are required" });
    }
    const checkin = await MoodCheckin.create({ emoji, label, userEmail: userEmail || "anonymous" });
    res.status(201).json({ message: "Mood saved!", checkin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/mood-checkin/stats — aggregated counts per label
router.get("/stats", async (req, res) => {
  try {
    const stats = await MoodCheckin.aggregate([
      { $group: { _id: { emoji: "$emoji", label: "$label" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
