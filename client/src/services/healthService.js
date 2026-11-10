import api from "./api";

export const calculateHealth = async (healthData) => {
  const response = await api.post("/health/calculate", healthData);
  return response.data;
};