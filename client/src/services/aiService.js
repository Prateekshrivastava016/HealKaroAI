import api from "./api";

export const generateDietPlan = async (dietData) => {
  const response = await api.post("/ai/diet-plan", dietData);
  return response.data;
};

export const getSavedDietPlan = async () => {
  const response = await api.get("/ai/diet-plan");
  return response.data;
};