const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const app = express();
const healthRoutes = require("./routes/healthRoutes");
const profileRoutes = require("./routes/profileRoutes");
const waterRoutes = require("./routes/waterRoutes");
const sleepRoutes = require("./routes/sleepRoutes");
const foodRoutes = require("./routes/foodRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const weightRoutes = require("./routes/weightRoutes");
const aiRoutes = require("./routes/aiRoutes");
const aiWorkoutRoutes = require("./routes/aiWorkoutRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/ai", aiWorkoutRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/weight", weightRoutes);
app.use("/api/exercise", exerciseRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/food", foodRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "healKaroAI API is running",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`healKaroAI server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });