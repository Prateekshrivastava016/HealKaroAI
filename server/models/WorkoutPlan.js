const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workoutPlan: {
      type: String,
      required: true,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);