
// const express = require("express");
// const Journal = require("../models/Journal");

// const router = express.Router();

// // ✅ Save journal (NO AUTH for now)
// router.post("/analyze", async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).json({ message: "Text is required" });
//     }

//     const journal = new Journal({
//       userId: "test_user",
//       text,
//       analysis: {},
//       riskScore: 0
//     });

//     await journal.save();

//     res.json({ message: "Saved successfully" });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Error" });
//   }
// });

// module.exports = router;










// const express = require("express");
// const axios = require("axios");
// const Journal = require("../models/Journal");

// const router = express.Router();

// router.post("/analyze", async (req, res) => {
//   try {
//     const { text, userId } = req.body;

//     if (!text) {
//       return res.status(400).json({ message: "Text is required" });
//     }

//     const mlResponse = await axios.post(
//   "https://upinderyashika12-manlytics-ml.hf.space/analyze",
//   { text }
// );
//     const analysis = mlResponse.data;

//     const journal = new Journal({
//       userId: userId && userId !== "test_user" ? userId : (userId || "test_user"),
//       text,
//       analysis,
//       riskScore: analysis.riskScore || 0,
//     });

//     await journal.save();
//     res.json(journal);
//   } catch (err) {
//     console.log("Journal analyze error:", err.message);
//     res.status(500).json({ error: "Error while analyzing text" });
//   }
// });

// router.get("/history/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const journals = await Journal.find({ userId })
//       .sort({ createdAt: 1 });
//     res.json(journals);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching history" });
//   }
// });

// module.exports = router;




const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Text is required",
      });
    }

    console.log("Sending request to Hugging Face...");

    const mlResponse = await axios.post(
      "https://upinderyashika12-manlytics-ml.hf.space/analyze",
      {
        text,
      }
    );

    console.log("HF Response:", mlResponse.data);

    // Direct response bhejo
    res.json(mlResponse.data);

  } catch (err) {
    console.error("ERROR:", err);

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    }

    res.status(500).json({
      error: err.message,
      details: err.response?.data || null,
    });
  }
});

module.exports = router;