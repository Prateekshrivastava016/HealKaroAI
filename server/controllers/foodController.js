const FoodEntry = require("../models/FoodEntry");

// Add food entry
const addFood = async (req, res) => {
  try {
    const {
      foodName,
      quantity,
      calories,
      protein,
      carbohydrates,
      fat,
      date,
      mealType,
    } = req.body;

    // Validate required fields
    if (
      !foodName ||
      !Number.isFinite(Number(quantity)) ||
      Number(quantity) <= 0 ||
      calories === undefined ||
      calories === null ||
      calories === "" ||
      !Number.isFinite(Number(calories)) ||
      Number(calories) < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid food name, quantity and calories.",
      });
    }

    const entryDate =
      date ||
      new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

    const food = await FoodEntry.create({
      user: req.user.userId,
      foodName: foodName.trim(),
      quantity: Number(quantity),
      calories: Number(calories),
      protein: Number(protein ?? 0),
      carbohydrates: Number(carbohydrates ?? 0),
      fat: Number(fat ?? 0),
      date: entryDate,
      mealType: mealType ||"Snacks",
    });

    return res.status(201).json({
      message: "Food added successfully.",
      data: food,
    });
  } catch (error) {
    console.error("Add food error:", error);

    return res.status(500).json({
      message: "Unable to add food entry.",
    });
  }
};

// Get food entries for a date
const getFoodEntries = async (req, res) => {
  try {
    const date =
      req.query.date ||
      new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      });

    const entries = await FoodEntry.find({
      user: req.user.userId,
      date,
    }).sort({ createdAt: -1 });

    const totals = entries.reduce(
      (result, item) => {
        result.calories += item.calories;
        result.protein += item.protein;
        result.carbohydrates += item.carbohydrates;
        result.fat += item.fat;
        return result;
      },
      {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
      }
    );

    return res.status(200).json({
      message: "Food entries fetched successfully.",
      data: entries,
      totals,
    });
  } catch (error) {
    console.error("Get food entries error:", error);

    return res.status(500).json({
      message: "Unable to fetch food entries.",
    });
  }
};

// Delete a food entry
const deleteFood = async (req, res) => {
  try {
    const food = await FoodEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!food) {
      return res.status(404).json({
        message: "Food entry not found.",
      });
    }

    return res.status(200).json({
      message: "Food entry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete food error:", error);

    return res.status(500).json({
      message: "Unable to delete food entry.",
    });
  }
};

module.exports = {
  addFood,
  getFoodEntries,
  deleteFood,
};