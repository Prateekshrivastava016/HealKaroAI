const express = require("express");
const { calculateHealth } = require("../controllers/healthController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/calculate", protect, calculateHealth);

module.exports = router;