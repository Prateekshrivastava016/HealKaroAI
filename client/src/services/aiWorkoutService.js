import api from "./api";

// Generate workout plan
export const generateWorkoutPlan = async (workoutData) => {
  const response = await api.post("/ai/workout-plan", workoutData);
  return response.data;
};

// Fetch saved workout plan
export const getSavedWorkoutPlan = async () => {
  const response = await api.get("/ai/workout-plan");
  return response.data;
};