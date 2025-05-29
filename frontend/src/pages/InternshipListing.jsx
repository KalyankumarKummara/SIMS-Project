import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaClock, FaCheckCircle } from "react-icons/fa";
import { Avatar } from "@mui/material";
import StudentDashboardNavbar from "../components/StudentNavbar";
import Footer from "../components/Studentfooter";
import API_BASE_URL from "../config";

const InternshipListingPage = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    let typingSpeed = 100;

    const type = () => {
      const currentPlaceholder = placeholderOptions[currentIndex];
      if (isDeleting) {
        currentText = currentPlaceholder.substring(0, currentText.length - 1);
      } else {
        currentText = currentPlaceholder.substring(0, currentText.length + 1);
      }
      setPlaceholderText(currentText);

      if (!isDeleting && currentText === currentPlaceholder) {
        setTimeout(() => (isDeleting = true), 1000);
      } else if (isDeleting && currentText === "") {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % placeholderOptions.length;
      }
      setTimeout(type, typingSpeed);
    };
    type();
  }, []);

  // Fetch internships data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/internships`);
        const data = await response.json();
        
        if (data.status === "success") {
          setInternships(data.data);
        } else {
          throw new Error("Failed to fetch internships");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter internships
  const filteredInternships = internships
    .filter(internship => internship.internship_status === "Active")
    .filter(internship => {
      const query = searchQuery.toLowerCase();
      return (
        internship.title.toLowerCase().includes(query) ||
        internship.company_name.toLowerCase().includes(query) ||
        internship.location.toLowerCase().includes(query) ||
        internship.duration.toLowerCase().includes(query)
      );
    });

  // Handle image loading errors
  const handleImgError = (e) => {
    e.target.src = '/default-logo.png';
  };

  // Handle action clicks
  const handleActionClick = (action, internshipId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate(action === "view" 
        ? `/internship/details/${internshipId}`
        : `/apply/${internshipId}`
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-purple-50">
      <StudentDashboardNavbar pageTitle="Available Internships" />
      
      <div className="flex-grow max-w-7xl mx-auto p-6 w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Find Your Dream Internship
        </h1>

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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : filteredInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInternships.map((internship) => (
              <div
                key={internship.internship_id}
                className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300 transform hover:-translate-y-2"
              >
                {/* Logo container without gray background */}
                <div className="flex justify-center items-center p-6">
                  {internship.company_logo ? (
                    <img
                      src={internship.company_logo}
                      alt={`${internship.company_name} logo`}
                      className="w-24 h-24 object-contain rounded-full border-2 border-blue-500"
                      onError={handleImgError}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 96,
                        height: 96,
                        fontSize: "2.5rem",
                        bgcolor: "#3b82f6",
                        color: "white",
                        border: "2px solid #3b82f6"
                      }}
                    >
                      {internship.company_name[0]?.toUpperCase() || "C"}
                    </Avatar>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {internship.title}
                  </h2>
                  <p className="text-gray-600 text-lg mb-4">
                    {internship.company_name}
                  </p>

                  <div className="flex items-center text-gray-600 mb-3">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    <span>{internship.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <FaClock className="mr-2 text-purple-500" />
                    <span>{internship.duration}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-6">
                    <FaCheckCircle className="mr-2 text-green-500" />
                    <span className="font-semibold text-green-500">
                      {internship.internship_status}
                    </span>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleActionClick("apply", internship.internship_id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => handleActionClick("view", internship.internship_id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No active internships found matching your search
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default InternshipListingPage;