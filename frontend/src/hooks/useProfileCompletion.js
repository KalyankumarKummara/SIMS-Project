import { useState } from "react";
import axios from "axios";

export const useProfileCompletion = (student_id) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (profileData) => {
    if (!student_id) {
      setError("Invalid student ID.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ Convert profileData to FormData for file uploads
      const formData = new FormData();
      
      Object.entries(profileData).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            // Append arrays properly
            value.forEach((item) => formData.append(`${key}[]`, item));
          } else {
            formData.append(key, value);
          }
        }
      });

      const response = await axios.put(
        `http://localhost:8000/Students/${student_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setLoading(false);
      return null;
    }
  };

  return { updateProfile, loading, error };
};
