import API from "./api";

export const getMoods = async () => {
  const response = await API.get("/moods");
  return response.data;
};

export const addMood = async (data) => {
  const response = await API.post("/moods", data);
  return response.data;
};

export const deleteMood = async (id) => {
  const response = await API.delete(`/moods/${id}`);
  return response.data;
};
