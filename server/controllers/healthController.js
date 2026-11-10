const {
  calculateHealthMetrics,
} = require("../services/healthCalculator");

// POST /api/health/calculate
const calculateHealth = async (req, res) => {
  try {
    const {
      weight,
      height,
      age,
      gender,
      activityLevel,
      goal,
    } = req.body;

    if (
      weight === undefined ||
      height === undefined ||
      age === undefined ||
      !gender ||
      !activityLevel ||
      !goal
    ) {
      return res.status(400).json({
        message: "All health calculation fields are required",
      });
    }

    const metrics = calculateHealthMetrics({
      weight,
      height,
      age,
      gender,
      activityLevel,
      goal,
    });

    res.status(200).json({
      message: "Health calculation successful",
      data: metrics,
    });
  } catch (error) {
    console.error("Health calculation error:", error.message);

    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  calculateHealth,
};