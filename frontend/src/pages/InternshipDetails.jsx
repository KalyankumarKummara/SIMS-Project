import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaCheckCircle, FaArrowLeft, FaShareAlt, FaPaperPlane, FaBookmark } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { Avatar } from "@mui/material";
import API_BASE_URL from "../config";

const InternshipDetails = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchInternshipDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/internships/${internshipId}`
        );
        const data = await response.json();

        if (response.ok && data.status === "success") {
          setInternship(data.data);
        } else {
          setError(data.message || "Failed to fetch internship details");
        }
      } catch (error) {
        setError("An error occurred while fetching internship details");
      } finally {
        setLoading(false);
      }
    };

    fetchInternshipDetails();
  }, [internshipId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/save`,
        { internship_id: internshipId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setIsSaved(true);
        alert("Internship saved successfully!");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Internship already saved.");
        setIsSaved(true);
      } else {
        console.error("Error saving internship:", error);
        alert("Failed to save internship. Please try again.");
      }
    }
  };

  const handleImgError = (e) => {
    e.target.src = '/default-logo.png';
    e.target.onerror = null; // Prevent infinite loop
  };

  const getCompanyInitials = (name) => {
    if (!name) return "C";
    const words = name.split(" ");
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return words.map((word) => word[0]).join("").substring(0, 2).toUpperCase();
  };

  const handleApplyNow = () => {
    navigate(`/apply/${internshipId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">No internship found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8">
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white rounded-xl mb-8 overflow-hidden">
        <div className="text-center w-full px-4">
          <div className="flex justify-center items-center p-4">
            {internship.company_logo ? (
              <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center overflow-hidden bg-white">
                <img
                  src={internship.company_logo}
                  alt={`${internship.company_name} logo`}
                  className="w-full h-full object-contain p-1"
                  onError={handleImgError}
                />
              </div>
            ) : (
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  fontSize: "2.5rem",
                  bgcolor: "#3b82f6",
                  color: "white",
                  border: "4px solid white"
                }}
              >
                {getCompanyInitials(internship.company_name)}
              </Avatar>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold break-words">{internship.title}</h1>
          <p className="text-lg md:text-xl mt-2 break-words px-2">{internship.company_name}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto pb-24"> 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Location */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaMapMarkerAlt className="mr-2 text-blue-500 text-xl" />
            <span className="text-gray-700">{internship.location}</span>
          </motion.div>

          {/* Duration */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaClock className="mr-2 text-purple-500 text-xl" />
            <span className="text-gray-700">{internship.duration}</span>
          </motion.div>

          {/* Status */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaCheckCircle className="mr-2 text-green-500 text-xl" />
            <span className="text-gray-700 font-semibold">
              {internship.internship_status}
            </span>
          </motion.div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-8 bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{internship.description}</p>
        </motion.div>

        {/* Required Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-8 bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Required Skills</h2>
          <ul className="flex flex-wrap gap-2">
            {internship.required_skills && internship.required_skills.length > 0
              ? internship.required_skills.map((skill, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </motion.li>
              ))
              : <li className="text-gray-600">No skills required</li>}
          </ul>
        </motion.div>

        {/* Stipend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-8 bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💰 Stipend</h2>
          <p className="text-gray-700">
            {internship.stipend_type === "Unpaid"
              ? "Unpaid"
              : internship.stipend_type === "Performance-based"
                ? "Performance-based"
                : `₹${internship.stipend_min} - ₹${internship.stipend_max}`}
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-8 bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Benefits</h2>
          <ul className="list-disc list-inside">
            {internship.benefits && internship.benefits.length > 0
              ? internship.benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-700"
                >
                  {benefit}
                </motion.li>
              ))
              : <li className="text-gray-700">No benefits specified</li>}
          </ul>
        </motion.div>

        {/* Application Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-8 bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Process</h2>
          <p className="text-gray-700 leading-relaxed">{internship.application_process}</p>
        </motion.div>

        {/* Contact Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-8 bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">✉️ Contact Email</h2>
          <p className="text-gray-700">{internship.contact_email}</p>
        </motion.div>

        {/* Back to Listings Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.0 }}
          className="flex justify-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            <FaArrowLeft className="mr-2" />
            <span className="font-medium">Back to Listings</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Action Buttons (FAB) - Mobile */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 sm:hidden">
        {/* Apply Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleApplyNow}
          className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          <FaPaperPlane className="text-xl" />
        </motion.button>

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
        >
          <FaShareAlt className="text-xl" />
        </motion.button>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className={`flex items-center justify-center w-14 h-14 ${isSaved ? "bg-gray-500" : "bg-yellow-500"} text-white rounded-full shadow-lg hover:${isSaved ? "bg-gray-600" : "bg-yellow-600"} transition-all duration-300`}
        >
          <FaBookmark className="text-xl" />
        </motion.button>
      </div>

      {/* Floating Action Buttons (FAB) - Desktop */}
      <div className="fixed bottom-6 right-6 hidden sm:flex flex-col gap-4">
        {/* Apply Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleApplyNow}
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
        >
          <FaPaperPlane className="mr-2" />
          <span>Apply Now</span>
        </motion.button>

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
        >
          <FaShareAlt className="mr-2" />
          <span>Share</span>
        </motion.button>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className={`flex items-center px-6 py-3 ${isSaved ? "bg-gray-500" : "bg-yellow-500"} text-white rounded-full shadow-lg hover:${isSaved ? "bg-gray-600" : "bg-yellow-600"} transition-all duration-300 transform hover:scale-110`}
        >
          <FaBookmark className="mr-2" />
          <span>{isSaved ? "Saved" : "Save"}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default InternshipDetails;