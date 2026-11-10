const ExerciseEntry = require("../models/ExerciseEntry");

// Add exercise
const addExercise = async (req, res) => {
  try {
    const {
      exerciseName,
      exerciseType,
      duration,
      caloriesBurned,
      date,
    } = req.body;

    if (!exerciseName || !duration || caloriesBurned === undefined) {
      return res.status(400).json({
        message: "Please provide all required fields.",
      });
    }

    const exercise = await ExerciseEntry.create({
      user: req.user.userId,
      exerciseName,
      exerciseType: exerciseType || "Other",
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned),
      date:
        date ||
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
    });

    res.status(201).json({
      message: "Exercise added successfully.",
      data: exercise,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add exercise.",
      error: error.message,
    });
  }
};

// Get daily exercises
const getExercises = async (req, res) => {
  try {
    const date =
      req.query.date ||
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
      }).format(new Date());

    const exercises = await ExerciseEntry.find({
      user: req.user.userId,
      date,
    }).sort({ createdAt: -1 });

    const totals = exercises.reduce(
      (total, exercise) => {
        total.duration += exercise.duration;
        total.caloriesBurned += exercise.caloriesBurned;
        return total;
      },
      { duration: 0, caloriesBurned: 0 }
    );

    res.status(200).json({
      data: exercises,
      totals,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load exercises.",
      error: error.message,
    });
  }
};

// Delete exercise
const deleteExercise = async (req, res) => {
  try {
    const exercise = await ExerciseEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!exercise) {
      return res.status(404).json({
        message: "Exercise not found.",
      });
    }

    res.status(200).json({
      message: "Exercise deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete exercise.",
      error: error.message,
    });
  }
};

module.exports = {
  addExercise,
  getExercises,
  deleteExercise,
};