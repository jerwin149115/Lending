import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const uploadDocument = async (formData) => {
  const res = await axios.post(
    `${BASE_URL}/document/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};

export const getDocuments = async () => {
  const res = await axios.get(`${BASE_URL}/document/get`);
  return res.data;
};

export const downloadDocument = async (id) => {
  const res = await axios.get(
    `${BASE_URL}/document/download/${id}`,
    { responseType: "blob" }
  );
  return res.data;
};

export const deleteDocument = async (id) => {
  const res = await axios.delete(`${BASE_URL}/document/delete/${id}`);
  return res.data;
};
