const User = require("../models/User");

// GET: Fetch logged-in user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// PUT: Update logged-in user's profile
const updateProfile = async (req, res) => {
  try {
    const { name, age, gender, height, weight, activityLevel, goal, dietaryPreference } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update only fields provided by the user
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }
      user.name = name.trim();
    }

    if (age !== undefined) {
      const value = Number(age);

      if (!Number.isFinite(value) || value < 1 || value > 120) {
        return res.status(400).json({
          message: "Age must be between 1 and 120",
        });
      }

      user.age = value;
    }

    if (gender !== undefined) {
      user.gender = gender;
    }

    if (height !== undefined) {
      const value = Number(height);

      if (!Number.isFinite(value) || value <= 0 || value > 300) {
        return res.status(400).json({
          message: "Please enter a valid height in centimeters",
        });
      }

      user.height = value;
    }

    if (weight !== undefined) {
      const value = Number(weight);

      if (!Number.isFinite(value) || value <= 0 || value > 700) {
        return res.status(400).json({
          message: "Please enter a valid weight in kilograms",
        });
      }

      user.weight = value;
    }

    if (activityLevel !== undefined) {
      user.activityLevel = activityLevel;
    }

    if (goal !== undefined) {
      user.goal = goal;
    }

    if (dietaryPreference !== undefined) {
      user.dietaryPreference = dietaryPreference;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-passwordHash");

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid profile details",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};