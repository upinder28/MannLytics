const mongoose = require("mongoose");

const LibraryBookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  conditionId: { type: String, required: true },
});

LibraryBookmarkSchema.index({ userId: 1, conditionId: 1 }, { unique: true });

module.exports = mongoose.model("LibraryBookmark", LibraryBookmarkSchema);