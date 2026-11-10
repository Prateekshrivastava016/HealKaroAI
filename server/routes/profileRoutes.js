const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");

// GET: Fetch logged-in user's profile
router.get("/", protect, getProfile);

// PUT: Update logged-in user's profile
router.put("/", protect, updateProfile);

module.exports = router;