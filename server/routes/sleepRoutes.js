const express = require("express");
const router = express.Router();

const {
  addSleepRecord,
  getSleepRecord,
} = require("../controllers/sleepController");

const protect = require("../middleware/authMiddleware");

// Save a sleep record
router.post("/", protect, addSleepRecord);

// Get sleep record for a specific date
router.get("/", protect, getSleepRecord);

module.exports = router;