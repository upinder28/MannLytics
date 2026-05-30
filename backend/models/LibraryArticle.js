const mongoose = require("mongoose");
const LibraryArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    emoji: { type: String, default: "📄" },
    tag: { type: String, default: "Condition" },
    tagColor: { type: String, default: "" },
    color: { type: String, default: "from-indigo-500 to-cyan-400" },
    definition: { type: String, required: true },
    overview: { type: String, default: "" },
    dailyImpact: { type: String, default: "" },
    symptoms: [{ type: String }],
    feels: { type: String, default: "" },
    coping: [{ type: String }],
    seek: { type: String, default: "" },
    crisis: { type: Boolean, default: false },
    related: [{ type: String }],
    pdfUrl: { type: String, default: "" },
    addedBy: { type: String, default: "admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LibraryArticle", LibraryArticleSchema);