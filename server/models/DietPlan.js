const mongoose = require("mongoose");

const dietPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dietPlan: {
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

module.exports = mongoose.model("DietPlan", dietPlanSchema);