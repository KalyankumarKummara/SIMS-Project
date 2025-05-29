import { useState } from "react";
import API_BASE_URL from "../config";

export const useRecruiterProfileCompletion = (company_id) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (formData) => {
    if (!company_id) {
      setError("Company ID is missing.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/Companies/${company_id}`, {
        method: "PUT",
        body: formData,  // Send FormData directly
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  return { updateProfile, loading, error };
};