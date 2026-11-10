const express = require("express");
const router = express.Router();

const {
  addExercise,
  getExercises,
  deleteExercise,
} = require("../controllers/exerciseController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addExercise);
router.get("/", protect, getExercises);
router.delete("/:id", protect, deleteExercise);

module.exports = router;