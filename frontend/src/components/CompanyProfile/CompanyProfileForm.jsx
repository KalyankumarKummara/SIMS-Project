import { useState, useEffect } from "react";
import { useRecruiterProfileCompletion } from "../../hooks/useRecruiterProfileCompletion";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CompanyNavbar from "../CompanyNavbar";
import Footer from "../Companyfooter";

export default function CompanyProfileForm() {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    industry: "",
    size: "",
    logo: null,
    description: "",
    website: "",
    social_links: {
      linkedin: "",
      twitter: "",
      facebook: "",
      other: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { updateProfile, loading, error } = useRecruiterProfileCompletion(user?.company_id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?.company_id) {
          console.error("Company ID is missing.");
          return;
        }

        const response = await fetch(`http://localhost:8000/user-details/${user.company_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }

        const companyData = await response.json();
        if (!companyData.data) {
          throw new Error("No data found in the response");
        }

        setFormData((prev) => ({
          ...prev,
          name: companyData.data.name,
          email: companyData.data.email,
        }));
      } catch (error) {
        console.error("Failed to fetch company data:", error);
      }
    };

    fetchUserData();
  }, [user?.company_id]);

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.phone) newErrors.phone = "Phone number is required.";
      if (!formData.location) newErrors.location = "Location is required.";
      if (!formData.industry) newErrors.industry = "Industry is required.";
      if (!formData.size) newErrors.size = "Company size is required.";
      if (!formData.description) newErrors.description = "Description is required.";
      if (!formData.logo) newErrors.logo = "Logo is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => setStep((prev) => prev - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("social_links.")) {
      const socialLinkField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [socialLinkField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      if (errors.logo) {
        setErrors((prev) => ({ ...prev, logo: "" }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("industry", formData.industry);
    formDataToSend.append("size", formData.size);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("website", formData.website);
    formDataToSend.append("social_links", JSON.stringify(formData.social_links));

    if (formData.logo) {
      formDataToSend.append("logo", formData.logo);
    }

    const result = await updateProfile(formDataToSend);

    if (result) {
      console.log("Profile updated successfully:", result);
      setIsSubmitted(true);

      setTimeout(() => {
        navigate("/recruiter-dashboard");
      }, 2000);
    } else {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <CompanyNavbar pageTitle="Profile Complete" />

      <main className="flex-grow flex justify-center items-center py-8">
        <motion.div
          className="max-w-2xl w-full mx-auto p-8 bg-white rounded-lg text-gray-900 border border-gray-300"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-3xl font-bold mb-8 text-center text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Company Profile Completion
          </motion.h2>
          {isSubmitted ? (
            <motion.div
              className="flex flex-col items-center justify-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-xl font-semibold text-gray-800">Profile updated successfully!</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center space-y-6"
            >
              {/* Step 1: Basic Details */}
              {step === 1 && (
                <>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      disabled
                      className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
                    />
                  </div>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 text-gray-900 cursor-not-allowed"
                    />
                  </div>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="location"
                      placeholder="Location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">Select Industry</option>
                      <option value="Tech/Software">Tech/Software</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Construction">Construction</option>
                      <option value="Telecom">Telecom</option>
                      <option value="Biotech">Biotech</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                    {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                  </div>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Company Size <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">Select Company Size</option>
                      <option value="Startup">Startup</option>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </select>
                    {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
                  </div>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Logo Upload <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L7 9m3-3 3 3"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, or JPEG (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          name="logo"
                          onChange={handleFileChange}
                          className="hidden"
                          required
                        />
                      </label>
                    </div>
                    {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
                  </div>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="Company Description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
                      rows="4"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>
                </>
              )}

              {/* Step 2: Additional Details */}
              {step === 2 && (
                <>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Company Website
                    </label>
                    <input
                      name="website"
                      placeholder="Website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      LinkedIn
                    </label>
                    <input
                      name="social_links.linkedin"
                      placeholder="LinkedIn"
                      value={formData.social_links.linkedin}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Twitter
                    </label>
                    <input
                      name="social_links.twitter"
                      placeholder="Twitter"
                      value={formData.social_links.twitter}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Facebook
                    </label>
                    <input
                      name="social_links.facebook"
                      placeholder="Facebook"
                      value={formData.social_links.facebook}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="w-3/4">
                    <label className="block mb-2 font-semibold text-gray-700 text-left">
                      Other
                    </label>
                    <input
                      name="social_links.other"
                      placeholder="Other"
                      value={formData.social_links.other}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-900 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 w-full gap-4">
                {step > 1 && (
                  <button
                    onClick={handlePrev}
                    className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Back
                  </button>
                )}
                {step < 2 ? (
                  <button
                    onClick={handleNext}
                    className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}