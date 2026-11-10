const mongoose = require("mongoose");

const waterLogSchema = new mongoose.Schema(
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

    amount: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

waterLogSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("WaterLog", waterLogSchema);