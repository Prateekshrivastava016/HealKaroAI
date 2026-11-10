const WaterLog = require("../models/WaterLog");

// Add water intake
const addWaterIntake = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Please enter a valid water amount in ml",
      });
    }

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const waterLog = await WaterLog.create({
      user: req.user.userId,
      date: today,
      amount,
    });

    return res.status(201).json({
      message: "Water intake added successfully",
      data: waterLog,
    });
  } catch (error) {
    console.error("Add water intake error:", error.message);
    return res.status(500).json({
      message: "Unable to save water intake",
    });
  }
};

// Get today's water intake
const getTodayWaterIntake = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const logs = await WaterLog.find({
      user: req.user.userId,
      date: today,
    }).sort({ createdAt: -1 });

    const totalIntake = logs.reduce(
      (total, log) => total + log.amount,
      0
    );

    return res.status(200).json({
      date: today,
      totalIntake,
      logs,
    });
  } catch (error) {
    console.error("Get water intake error:", error.message);
    return res.status(500).json({
      message: "Unable to fetch water intake",
    });
  }
};

module.exports = {
  addWaterIntake,
  getTodayWaterIntake,
};