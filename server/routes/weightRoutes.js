const express = require("express");
const router = express.Router();

const {
  addWeight,
  getWeights,
  deleteWeight,
} = require("../controllers/weightController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addWeight);
router.get("/", protect, getWeights);
router.delete("/:id", protect, deleteWeight);

module.exports = router;