const express = require("express");
const router = express.Router();

const {
  generateWorkoutPlan,
  getSavedWorkoutPlan,
} = require("../controllers/aiWorkoutController");

const protect = require("../middleware/authMiddleware");

// Generate workout plan
router.post("/workout-plan", protect, generateWorkoutPlan);

// Fetch saved workout plan
router.get("/workout-plan", protect, getSavedWorkoutPlan);

module.exports = router;