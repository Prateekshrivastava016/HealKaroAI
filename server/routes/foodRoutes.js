const express = require("express");
const router = express.Router();

const {
  addFood,
  getFoodEntries,
  deleteFood,
} = require("../controllers/foodController");

const protect = require("../middleware/authMiddleware");

// Add a food entry
router.post("/", protect, addFood);

// Get food entries for a date
router.get("/", protect, getFoodEntries);

// Delete a food entry
router.delete("/:id", protect, deleteFood);

module.exports = router;