import axios from "axios";
import API_BASE_URL from "../config";

const API = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

 export const updateProfileApi = async (studentId, formData) => {
  const response = await fetch(
    `${API_BASE_URL}/Students/${studentId}`,  // ✅ Corrected API URL
    {
      method: "PUT",
      body: formData,  // If sending FormData
    }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
};

export default API;
