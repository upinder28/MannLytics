const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Journal = require("../models/Journal");

const router = express.Router();

// GET /api/user/:email
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/user/update
router.put("/update", async (req, res) => {
  try {
    const { email, name, darkMode, notifications } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { name, darkMode, notifications },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/user/update-password
router.put("/update-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.password) return res.status(400).json({ error: "This account uses Google login" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/user/:email
router.delete("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    await User.findOneAndDelete({ email });
    await Journal.deleteMany({ email });
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
