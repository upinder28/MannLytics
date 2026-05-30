// routes/safeSpaceRoutes.js
const express = require("express");
const {
  getSafeSpaceItems,
  seedSafeSpaceItems,
} = require("../controllers/safeSpaceController");

const router = express.Router();

router.get("/", getSafeSpaceItems);
router.post("/seed", seedSafeSpaceItems);

module.exports = router;
