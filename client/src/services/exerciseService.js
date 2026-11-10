import api from "./api";

// Add exercise
export const addExercise = async (exerciseData) => {
  const response = await api.post("/exercise", exerciseData);
  return response.data;
};

// Get exercises
export const getExercises = async () => {
  const response = await api.get("/exercise");
  return response.data;
};

// Delete exercise
export const deleteExercise = async (id) => {
  const response = await api.delete(`/exercise/${id}`);
  return response.data;
};