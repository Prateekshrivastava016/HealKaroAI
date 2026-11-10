const express = require("express");
const router = express.Router();

const {
  addWaterIntake,
  getTodayWaterIntake,
} = require("../controllers/waterController");

const protect = require("../middleware/authMiddleware");

// Add water intake
router.post("/", protect, addWaterIntake);

// Get today's water intake
router.get("/today", protect, getTodayWaterIntake);

module.exports = router;