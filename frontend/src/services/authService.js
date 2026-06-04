import API from "./api";

export const login = async (email, password) => {
  const response = await API.post("/login", { email, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await API.post("/register", { username, email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get("/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put("/profile", profileData);
  return response.data;
};

export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await API.post("/profile/upload-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProfilePhoto = async () => {
  const response = await API.delete("/profile/delete-photo");
  return response.data;
};
