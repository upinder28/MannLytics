const SafeSpaceItem = require("../models/SafeSpaceItem");

const getSafeSpaceItems = async (req, res) => {
  try {
    const items = await SafeSpaceItem.find({ isActive: true });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const seedSafeSpaceItems = async (req, res) => {
  try {
    res.status(200).json({ message: "Seed route working" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSafeSpaceItems,
  seedSafeSpaceItems,
};
