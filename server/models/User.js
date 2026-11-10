const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    age: {
      type: Number,
      required: true,
      min: 13,
      max: 100,
    },

    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },

    height: {
      type: Number,
      required: true,
      min: 50,
      max: 250,
    },

    weight: {
      type: Number,
      required: true,
      min: 10,
      max: 300,
    },

    activityLevel: {
      type: String,
      required: true,
      enum: [
        "sedentary",
        "lightly_active",
        "moderately_active",
        "very_active",
        "extra_active",
      ],
    },

    goal: {
      type: String,
      enum: [
        "gain_weight",
        "lose_weight",
        "maintain_weight",
        "muscle_gain",
      ],
      default: "maintain_weight",
    },

    dietaryPreference: {
      type: String,
      required: true,
      enum: [
        "vegetarian",
        "non_vegetarian",
        "vegan",
        "eggetarian",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);