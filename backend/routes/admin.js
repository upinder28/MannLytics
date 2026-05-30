const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Journal = require("../models/Journal");
const SafeSpaceItem = require("../models/SafeSpaceItem");
const LibraryArticle = require("../models/LibraryArticle");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@mannlytics.com").toLowerCase().trim();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "admin123").trim();

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("LOGIN ATTEMPT:", JSON.stringify({ email, password }));
  console.log("EXPECTED:", JSON.stringify({ ADMIN_EMAIL, ADMIN_PASSWORD }));
  if (email?.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
  const token = jwt.sign(
    { email: ADMIN_EMAIL, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
  res.json({ token, message: "Admin login successful" });
});

// GET /api/admin/users
router.get("/users", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({ email: { $ne: ADMIN_EMAIL } }, { password: 0, __v: 0 }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// PUT /api/admin/users/:id
router.put("/users/:id", adminMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) return res.status(400).json({ message: "Nothing to update" });
    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (email) updateFields.email = email.trim().toLowerCase();
    const updated = await User.findByIdAndUpdate(req.params.id, { $set: updateFields }, { new: true, select: "-password -__v" });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await Journal.deleteMany({ userId: user.email });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User and their journals deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

// GET /api/admin/journals
router.get("/journals", adminMiddleware, async (req, res) => {
  try {
    const journals = await Journal.find().sort({ createdAt: -1 }).limit(200);
    res.json(journals);
  } catch (err) {
    res.status(500).json({ message: "Error fetching journals", error: err.message });
  }
});

// DELETE /api/admin/journals/:id
router.delete("/journals/:id", adminMiddleware, async (req, res) => {
  try {
    const journal = await Journal.findByIdAndDelete(req.params.id);
    if (!journal) return res.status(404).json({ message: "Journal not found" });
    res.json({ message: "Journal deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting journal", error: err.message });
  }
});

// GET /api/admin/analytics
router.get("/analytics", adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ email: { $ne: ADMIN_EMAIL } });
    const totalJournals = await Journal.countDocuments();
    const riskAgg = await Journal.aggregate([
      { $group: { _id: null, avgRisk: { $avg: "$riskScore" }, highRisk: { $sum: { $cond: [{ $gte: ["$riskScore", 70] }, 1, 0] } }, moderateRisk: { $sum: { $cond: [{ $and: [{ $gte: ["$riskScore", 40] }, { $lt: ["$riskScore", 70] }] }, 1, 0] } }, lowRisk: { $sum: { $cond: [{ $lt: ["$riskScore", 40] }, 1, 0] } } } },
    ]);
    const emotionAgg = await Journal.aggregate([
      { $group: { _id: { $toLower: "$analysis.emotion" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const dailyAgg = await Journal.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ totalUsers, totalJournals, riskStats: riskAgg[0] || { avgRisk: 0, highRisk: 0, moderateRisk: 0, lowRisk: 0 }, emotionBreakdown: emotionAgg, dailyEntries: dailyAgg });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics", error: err.message });
  }
});

// ─── LIBRARY ─────────────────────────────────────────────────────────────────

router.get("/library/public", async (req, res) => {
  try {
    const articles = await LibraryArticle.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching articles", error: err.message });
  }
});

router.get("/library", adminMiddleware, async (req, res) => {
  try {
    const articles = await LibraryArticle.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching articles", error: err.message });
  }
});

router.post("/library", adminMiddleware, async (req, res) => {
  try {
    const { title, emoji, tag, definition, overview, dailyImpact, symptoms, coping, seek, feels, crisis } = req.body;
    if (!title || !definition) return res.status(400).json({ message: "Title and definition are required" });
    const article = await LibraryArticle.create({ title, emoji, tag, definition, overview, dailyImpact, symptoms, coping, seek, feels, crisis });
    res.status(201).json({ message: "Article created", article });
  } catch (err) {
    res.status(500).json({ message: "Error creating article", error: err.message });
  }
});

router.put("/library/:id", adminMiddleware, async (req, res) => {
  try {
    const updated = await LibraryArticle.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article updated", article: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating article", error: err.message });
  }
});

router.delete("/library/:id", adminMiddleware, async (req, res) => {
  try {
    const deleted = await LibraryArticle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting article", error: err.message });
  }
});

// ─── SAFE SPACE ───────────────────────────────────────────────────────────────

router.get("/safespace/public", async (req, res) => {
  try {
    const items = await SafeSpaceItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items", error: err.message });
  }
});

router.get("/safespace", adminMiddleware, async (req, res) => {
  try {
    const items = await SafeSpaceItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching items", error: err.message });
  }
});

router.post("/safespace", adminMiddleware, async (req, res) => {
  try {
    const { title, description, category, mediaType, url, duration } = req.body;
    if (!title || !category) return res.status(400).json({ message: "Title and category are required" });
    const item = await SafeSpaceItem.create({ title, description, category, mediaType, url, duration });
    res.status(201).json({ message: "Item created", item });
  } catch (err) {
    res.status(500).json({ message: "Error creating item", error: err.message });
  }
});

router.put("/safespace/:id", adminMiddleware, async (req, res) => {
  try {
    const updated = await SafeSpaceItem.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item updated", item: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating item", error: err.message });
  }
});

router.delete("/safespace/:id", adminMiddleware, async (req, res) => {
  try {
    const deleted = await SafeSpaceItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item", error: err.message });
  }
});

module.exports = router;
