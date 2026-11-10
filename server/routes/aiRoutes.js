const express = require("express");
const router = express.Router();

const {
  generateDietPlan, getSavedDietPlan,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

router.post("/diet-plan", protect, generateDietPlan);
router.get("/diet-plan", protect, getSavedDietPlan);
module.exports = router;