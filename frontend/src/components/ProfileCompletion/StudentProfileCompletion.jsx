import { useState, useEffect } from "react";
import axios from "axios";
import BasicDetails from "./BasicDetails";
import ResumeSocialLinks from "./ResumeSocialLinks";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import StudentDashboardNavbar from "../StudentNavbar";
import Footer from "../Studentfooter";

const StudentProfileCompletion = () => {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    student_id: user?.student_id || "",
    college: "",
    department: "",
    registration_number: "",
    skills: [],
    social_links: {},
    profile_img: null,
    resume_link: null,
  });

  useEffect(() => {
    if (user?.student_id) {
      setProfileData((prevData) => ({
        ...prevData,
        student_id: user.student_id,
      }));
    }
  }, [user]);

  const handleDataUpdate = (newData) => {
    setProfileData((prevData) => {
      const updatedData = { ...prevData, ...newData };
      return updatedData;
    });
  };

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 2));

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      for (const key in profileData) {
        if (key === "profile_img" || key === "resume_link") {
          if (profileData[key] instanceof File) {
            formData.append(key, profileData[key]);
          }
        } else if (key === "social_links" || key === "skills") {
          formData.append(key, JSON.stringify(profileData[key] ?? []));
        } else {
          formData.append(key, profileData[key] ?? "");
        }
      }

      const response = await axios.put(
        `http://localhost:8000/Students/${profileData.student_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.status === "success") {
        alert("Profile updated successfully!");
        navigate("/student-dashboard");
      } else {
        alert(`Profile update failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("An error occurred while submitting the profile.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <StudentDashboardNavbar pageTitle="Profile Completion"/>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {step === 1 && (
          <BasicDetails
            data={profileData}
            setData={handleDataUpdate}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <ResumeSocialLinks
            data={profileData}
            setData={handleDataUpdate}
            handleSubmit={handleSubmit}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StudentProfileCompletion;