import api from "./api";

// Add food entry
export const addFoodEntry = async (foodData) => {
  const response = await api.post("/food", foodData);
  return response.data;
};

// Get food entries for a selected date
export const getFoodEntries = async (date) => {
  const response = await api.get("/food", {
    params: { date },
  });
  return response.data;
};

// Delete a food entry
export const deleteFoodEntry = async (id) => {
  const response = await api.delete(`/food/${id}`);
  return response.data;
};