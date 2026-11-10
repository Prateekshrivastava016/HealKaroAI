const mongoose = require("mongoose");

const sleepLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    sleepTime: {
      type: String,
      required: true,
    },

    wakeTime: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
  },
  { timestamps: true }
);

sleepLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("SleepLog", sleepLogSchema);