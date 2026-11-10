const WeightEntry = require("../models/WeightEntry");

const addWeight = async (req, res) => {
  try {
    const { weight, date } = req.body;

    if (!weight || Number(weight) <= 0) {
      return res.status(400).json({
        message: "Please enter a valid weight.",
      });
    }

    const entry = await WeightEntry.create({
      user: req.user.userId,
      weight: Number(weight),
      date:
        date ||
        new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
    });

    res.status(201).json({
      message: "Weight saved successfully.",
      data: entry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save weight.",
      error: error.message,
    });
  }
};

const getWeights = async (req, res) => {
  try {
    const weights = await WeightEntry.find({
      user: req.user.userId,
    }).sort({ date: 1, createdAt: 1 });

    res.status(200).json({
      data: weights,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch weights.",
      error: error.message,
    });
  }
};

const deleteWeight = async (req, res) => {
  try {
    const weight = await WeightEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!weight) {
      return res.status(404).json({
        message: "Weight entry not found.",
      });
    }

    res.status(200).json({
      message: "Weight deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete weight.",
      error: error.message,
    });
  }
};

module.exports = { addWeight, getWeights, deleteWeight };