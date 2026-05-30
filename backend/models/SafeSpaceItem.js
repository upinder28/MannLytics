const mongoose = require("mongoose");

const SafeSpaceItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, required: true },
    mediaType: { type: String, default: "text" },
    url: { type: String, default: "" },
    duration: { type: String, default: "" },
  },
  { timestamps: true }
);

SafeSpaceItemSchema.index({ title: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("SafeSpaceItem", SafeSpaceItemSchema);
