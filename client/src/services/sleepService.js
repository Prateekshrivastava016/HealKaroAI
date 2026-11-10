import api from "./api";

// Save sleep record
export const addSleepRecord = async (sleepData) => {
  const response = await api.post("/sleep", sleepData);
  return response.data;
};

// Get sleep record for a specific date
export const getSleepRecord = async (date) => {
  const response = await api.get("/sleep", {
    params: { date },
  });

  return response.data;
};