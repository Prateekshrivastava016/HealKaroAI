import api from "./api";

// Get today's water intake
export const getTodayWaterIntake = async () => {
  const response = await api.get("/water/today");
  return response.data;
};

// Add water intake
export const addWaterIntake = async (amount) => {
  const response = await api.post("/water", { amount });
  return response.data;
};