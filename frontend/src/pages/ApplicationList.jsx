import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CompanyNavbar from "../components/CompanyNavbar";
import Footer from "../components/Companyfooter";
import API_BASE_URL from "../config";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Grid,
  Box,
} from "@mui/material";
import {
  School as SchoolIcon,
  Book as BookIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  Info as InfoIcon,
  Cake as CakeIcon,
  Transgender as TransgenderIcon,
  LocationOn as LocationIcon,
  Code as CodeIcon,
  CalendarToday as CalendarIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { FaSearch } from "react-icons/fa";
import ResumePreview from "../components/ResumePreview"; 

const ApplicationsList = () => {
  const { internship_id, application_id } = useParams(); 
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState("");
  const navigate = useNavigate();

  // Dynamic placeholder text for search box
  const [placeholderText, setPlaceholderText] = useState("");
  const placeholderOptions = [
    "Search by name...",
    "Search by email...",
    "Search by college...",
    "Search by department...",
    "Search by location...",
    "Search by gender...",
    "Search by skills...",
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

  // Fetch applications for the specific internship or a specific application
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "recruiter") {
      navigate("/login");
      return;
    }

    const fetchApplications = async () => {
      try {
        let response;
        if (application_id) {
          // Fetch a specific application
          response = await fetch(`${API_BASE_URL}/applications/${application_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          // Fetch all applications for the internship
          response = await fetch(`${API_BASE_URL}/internships/${internship_id}/applications`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        if (data.status === "success") {
          if (application_id) {
            // If fetching a specific application, set it as the only application
            setApplications([data.data]);
            setFilteredApplications([data.data]);
          } else {
            // If fetching all applications, set them as usual
            setApplications(data.data);
            setFilteredApplications(data.data);
          }
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [internship_id, application_id, navigate]);

  // Filter applications based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = applications.filter((application) => {
        const query = searchQuery.toLowerCase();
        return (
          application.full_name.toLowerCase().includes(query) || 
          application.email.toLowerCase().includes(query) || 
          application.college.toLowerCase().includes(query) ||
          application.department.toLowerCase().includes(query) ||
          application.location.toLowerCase().includes(query) ||
          application.gender.toLowerCase().includes(query) ||
          application.skills.some((skill) => skill.toLowerCase().includes(query))
        );
      });
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications(applications);
    }
  }, [searchQuery, applications]);

  // Handle opening the resume preview modal
  const handleResumePreviewOpen = (resumeUrl) => {
    setSelectedResumeUrl(resumeUrl);
    setResumePreviewOpen(true);
  };

  // Handle closing the resume preview modal
  const handleResumePreviewClose = () => {
    setResumePreviewOpen(false);
    setSelectedResumeUrl("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <Card className="p-6 shadow-lg">
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Card>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <Card className="p-6 shadow-lg">
          <Typography variant="h6" color="textSecondary">
            No applicants found for this internship.
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Add the Company Navbar */}
      <CompanyNavbar pageTitle="Applicants Details" />

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
         <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom sx={{ textAlign: "center" }}>
          Applicants Details
        </Typography>

        {/* Updated Search Box */}
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

        {/* Applications Grid */}
        <Grid container spacing={4}>
          {filteredApplications.map((application, index) => (
            <Grid item xs={12} sm={6} md={4} key={application._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <CardContent>
                    {/* Profile Section */}
                    <Box display="flex" alignItems="center" mb={3}>
                      <Avatar
                        src={application.profile_img}
                        className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 text-white text-2xl font-bold shadow-lg"
                      >
                        {application.full_name[0]}
                      </Avatar>
                      <Box ml={2}>
                        <Typography variant="h6" className="font-semibold text-gray-800">
                          {application.full_name}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                          {application.email}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Application Details */}
                    <Box className="space-y-2">
                      <DetailItem icon={<SchoolIcon />} label="College" value={application.college} />
                      <DetailItem icon={<BookIcon />} label="Department" value={application.department} />
                      <DetailItem icon={<BadgeIcon />} label="Registration Number" value={application.registration_number} />
                      <DetailItem icon={<PhoneIcon />} label="Phone" value={application.phone} />
                      <DetailItem icon={<InfoIcon />} label="About" value={application.about} />
                      <DetailItem icon={<CakeIcon />} label="Date of Birth" value={application.dob} />
                      <DetailItem icon={<TransgenderIcon />} label="Gender" value={application.gender} />
                      <DetailItem icon={<LocationIcon />} label="Location" value={application.location} />
                      <DetailItem icon={<CodeIcon />} label="Skills" value={application.skills.join(", ")} />
                      <DetailItem icon={<CalendarIcon />} label="Applied On" value={new Date(application.date_applied).toLocaleDateString()} />
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" className="text-gray-600">
                          <span className="font-medium">Status:</span>{" "}
                          <Chip
                            label={application.status}
                            className={`ml-2 ${application.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : application.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          />
                        </Typography>
                      </Box>
                    </Box>

                    {/* Social Links */}
                    <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                      <Button
                        variant="outlined"
                        startIcon={<LinkedInIcon />}
                        href={application.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                        sx={{ flex: "1 1 auto", minWidth: "120px", mb: { xs: 1, sm: 0 } }}
                      >
                        LinkedIn
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<GitHubIcon />}
                        href={application.social_links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                        sx={{ flex: "1 1 auto", minWidth: "120px", mb: { xs: 1, sm: 0 } }}
                      >
                        GitHub
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DescriptionIcon />}
                        onClick={() => handleResumePreviewOpen(application.resume_link)}
                        className="text-blue-500 hover:text-blue-700"
                        sx={{ flex: "1 1 auto", minWidth: "120px", mb: { xs: 1, sm: 0 } }}
                      >
                        View Resume
                      </Button>
                    </Box>

                    {/* Status Update Button */}
                    <Box mt={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => navigate(`/applications/${application._id}/update-status`)}
                      >
                        Update Status
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Resume Preview Modal */}
      {resumePreviewOpen && (
        <ResumePreview
          resumeUrl={selectedResumeUrl}
          onClose={handleResumePreviewClose}
        />
      )}

      {/* Add the Footer */}
      <Footer />
    </div>
  );
};

// Reusable component for detail items
const DetailItem = ({ icon, label, value }) => (
  <Box display="flex" alignItems="center">
    <Box className="text-blue-400 mr-2">{icon}</Box>
    <Typography variant="body2" className="text-gray-600">
      <span className="font-medium">{label}:</span> {value}
    </Typography>
  </Box>
);

export default ApplicationsList;