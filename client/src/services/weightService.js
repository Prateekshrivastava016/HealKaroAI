import api from "./api";

export const addWeight = async (weightData) => {
  const response = await api.post("/weight", weightData);
  return response.data;
};

export const getWeights = async () => {
  const response = await api.get("/weight");
  return response.data;
};

export const deleteWeight = async (id) => {
  const response = await api.delete(`/weight/${id}`);
  return response.data;
};