import { createContext, useContext, useState } from "react";
import API_BASE_URL from "../config";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [data, setData] = useState({
    step: 1,
    basicDetails: {},
    educationDetails: {},
    skills: [],
    experience: [],
    certifications: [],
    projects: [],
    resume: null,
    socialLinks: {},
  });

  const updateProfile = async (studentId, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Students/${studentId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <ProfileContext.Provider value={{ data, setData, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// ✅ Custom Hook for using Profile Context
export const useProfile = () => {
  return useContext(ProfileContext);
};
