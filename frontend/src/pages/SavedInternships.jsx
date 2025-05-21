import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaTrash,
  FaBookmark,
  FaRegBookmark,
  FaMapMarkerAlt,
  FaClock,
  FaBriefcase,
  FaLightbulb,
  FaMoneyBillWave,
  FaSearch,
} from "react-icons/fa";
import {
  Container,
  Grid,
  Box,
  Link,
  Typography,
} from "@mui/material";
import { Facebook as FacebookIcon, Twitter as TwitterIcon, LinkedIn as LinkedInIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StudentDashboardNavbar from "../components/StudentNavbar";
import Footer from "../components/Studentfooter";

const SavedInternships = () => {
  const [savedInternships, setSavedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Dynamic placeholder text for search box
  const [placeholderText, setPlaceholderText] = useState("");
  const placeholderOptions = [
    "Search by title...",
    "Search by company...",
    "Search by location...",
    "Search by duration...",
  ];

  // Typing effect for placeholder
  useEffect(() => {
    let currentIndex = 0;
    let currentText = "";
    let isDeleting = false;
    let typingSpeed = 100; // Speed of typing (in milliseconds)

    const type = () => {
      const currentPlaceholder = placeholderOptions[currentIndex];

      if (isDeleting) {
        // Erase text
        currentText = currentPlaceholder.substring(0, currentText.length - 1);
      } else {
        // Add text
        currentText = currentPlaceholder.substring(0, currentText.length + 1);
      }

      setPlaceholderText(currentText);

      if (!isDeleting && currentText === currentPlaceholder) {
        // Pause at the end of typing
        setTimeout(() => (isDeleting = true), 1000);
      } else if (isDeleting && currentText === "") {
        // Move to the next placeholder
        isDeleting = false;
        currentIndex = (currentIndex + 1) % placeholderOptions.length;
      }

      setTimeout(type, typingSpeed);
    };

    type();
  }, []);

  // ✅ Fetch Saved Internships
  useEffect(() => {
    const fetchSavedInternships = async () => {
      try {
        const token = localStorage.getItem("token"); // Get auth token
        const response = await axios.get("http://127.0.0.1:8000/saved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedInternships(response.data.saved_internships);
      } catch (error) {
        console.error("Error fetching saved internships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedInternships();
  }, []);

  // ✅ Remove Saved Internship
  const removeSavedInternship = async (internshipId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/remove/${internshipId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI after removal
      setSavedInternships((prev) => prev.filter((internship) => internship._id !== internshipId));
    } catch (error) {
      console.error("Error removing saved internship:", error);
    }
  };

  // Filter saved internships based on search query
  const filteredInternships = savedInternships.filter((internship) => {
    const query = searchQuery.toLowerCase();
    return (
      internship.title.toLowerCase().includes(query) ||
      internship.company_name.toLowerCase().includes(query) ||
      internship.location.toLowerCase().includes(query) ||
      internship.duration.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-50 to-blue-50">
      {/* Navbar */}
      <StudentDashboardNavbar pageTitle="Saved Internships" />

      {/* Main Content */}
      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full">
          {/* Title */}
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            <FaBookmark className="inline-block mr-2 text-purple-600" />
            Saved Internships
          </h2>

          {/* Search Box */}
          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholderText}
                className="w-full px-6 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all shadow-lg"
              />
              <FaSearch className="absolute left-4 top-3.5 text-gray-400 text-xl" />
            </div>
          </div>

          {/* Internship List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredInternships.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-600 flex flex-col justify-center items-center h-full"
            >
              <FaRegBookmark className="text-6xl mx-auto text-purple-400 mb-4" />
              <p className="text-xl">No saved internships found.</p>
              <p className="text-gray-500">Try adjusting your search or save more internships.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredInternships.map((internship) => (
                <motion.div
                  key={internship._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{internship.title}</h3>
                    <p className="text-gray-600 mb-4 flex items-center">
                      <FaBriefcase className="mr-2 text-purple-600" />
                      {internship.company_name}
                    </p>
                    <div className="flex items-center text-gray-500 mb-4">
                      <FaMapMarkerAlt className="mr-2 text-purple-600" />
                      <span className="mr-4">{internship.location}</span>
                      <FaClock className="mr-2 text-purple-600" />
                      <span>{internship.duration}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{internship.description.substring(0, 100)}...</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {internship.required_skills &&
                        internship.required_skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            <FaLightbulb className="mr-1 text-purple-600" />
                            {skill}
                          </span>
                        ))}
                    </div>
                    <div className="flex items-center text-gray-700 mb-4">
                      <FaMoneyBillWave className="mr-2 text-purple-600" />
                      <span>
                        {internship.stipend_type === "Unpaid"
                          ? "Unpaid"
                          : internship.stipend_type === "Performance-based"
                          ? "Performance-based"
                          : `₹${internship.stipend_min} - ₹${internship.stipend_max}`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSavedInternship(internship._id)}
                    className="w-full flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-b-lg hover:bg-red-600 transition transform hover:scale-105"
                  >
                    <FaTrash className="mr-2" />
                    Remove
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default SavedInternships;