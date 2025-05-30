import axios from "axios";
import API_BASE_URL from "../config";

console.log("🔧 API Base URL from .env:", API_BASE_URL);

const API = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

 export const updateProfileApi = async (studentId, formData) => {
  const response = await fetch(
    `${API_BASE_URL}/Students/${studentId}`,  
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
