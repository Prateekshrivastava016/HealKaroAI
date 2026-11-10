const SleepLog = require("../models/SleepLog");

// Add sleep record
const addSleepRecord = async (req, res) => {
  try {
    const { sleepTime, wakeTime, date } = req.body;

    if (!sleepTime || !wakeTime || !date) {
      return res.status(400).json({
        message: "Sleep time, wake time, and date are required.",
      });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        message: "Date must be in YYYY-MM-DD format.",
      });
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(sleepTime) || !timeRegex.test(wakeTime)) {
      return res.status(400).json({
        message: "Time must be in HH:MM format.",
      });
    }

    const [sleepHours, sleepMinutes] = sleepTime.split(":").map(Number);
    const [wakeHours, wakeMinutes] = wakeTime.split(":").map(Number);

    const sleepMinutesTotal = sleepHours * 60 + sleepMinutes;
    let wakeMinutesTotal = wakeHours * 60 + wakeMinutes;

    // Handle sleep that crosses midnight
    if (wakeMinutesTotal <= sleepMinutesTotal) {
      wakeMinutesTotal += 24 * 60;
    }

    const duration =
      (wakeMinutesTotal - sleepMinutesTotal) / 60;

    if (duration <= 0 || duration > 24) {
      return res.status(400).json({
        message: "Invalid sleep duration.",
      });
    }

    const sleepLog = await SleepLog.create({
      user: req.user.userId,
      date,
      sleepTime,
      wakeTime,
      duration: Number(duration.toFixed(2)),
    });

    return res.status(201).json({
      message: "Sleep record saved successfully.",
      data: sleepLog,
    });
  } catch (error) {
    console.error("Add sleep record error:", error.message);

    return res.status(500).json({
      message: "Unable to save sleep record.",
    });
  }
};

// Get sleep record for a date
const getSleepRecord = async (req, res) => {
  try {
    const date = req.query.date;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        message: "Please provide a valid date in YYYY-MM-DD format.",
      });
    }

    const sleepLog = await SleepLog.findOne({
      user: req.user.userId,
      date,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      date,
      data: sleepLog,
      duration: sleepLog ? sleepLog.duration : 0,
    });
  } catch (error) {
    console.error("Get sleep record error:", error.message);

    return res.status(500).json({
      message: "Unable to fetch sleep record.",
    });
  }
};

module.exports = {
  addSleepRecord,
  getSleepRecord,
};