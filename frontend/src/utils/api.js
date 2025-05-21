import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

 export const updateProfileApi = async (studentId, formData) => {
  const response = await fetch(
    `http://127.0.0.1:8000/Students/${studentId}`,  // ✅ Corrected API URL
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
