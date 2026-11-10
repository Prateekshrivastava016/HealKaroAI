const mongoose = require("mongoose");

const foodEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    
    mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snacks"],
    default: "Snacks",
    required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    calories: {
      type: Number,
      required: true,
      min: 0,
    },

    protein: {
      type: Number,
      default: 0,
      min: 0,
    },

    carbohydrates: {
      type: Number,
      default: 0,
      min: 0,
    },

    fat: {
      type: Number,
      default: 0,
      min: 0,
    },

    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FoodEntry", foodEntrySchema);