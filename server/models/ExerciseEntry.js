const mongoose = require("mongoose");

const exerciseEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    exerciseName: {
      type: String,
      required: true,
      trim: true,
    },
    exerciseType: {
      type: String,
      enum: ["Cardio", "Strength", "Yoga", "Sports", "Other"],
      default: "Other",
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    caloriesBurned: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExerciseEntry", exerciseEntrySchema);