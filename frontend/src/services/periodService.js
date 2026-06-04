import API from "./api";

export const getPeriods = async () => {
  const response = await API.get("/periods");
  return response.data;
};

export const getPrediction = async () => {
  const response = await API.get("/periods/prediction");
  return response.data;
};

export const addPeriod = async (data) => {
  const response = await API.post("/periods", data);
  return response.data;
};

export const updatePeriod = async (id, data) => {
  const response = await API.put(`/periods/${id}`, data);
  return response.data;
};

export const deletePeriod = async (id) => {
  const response = await API.delete(`/periods/${id}`);
  return response.data;
};
