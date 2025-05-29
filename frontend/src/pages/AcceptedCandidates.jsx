import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyNavbar from "../components/CompanyNavbar";
import Footer from "../components/Companyfooter";
import API_BASE_URL from "../config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Modal,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaSearch } from "react-icons/fa";
import ResumePreview from "../components/ResumePreview"; // Import the ResumePreview component

const AcceptedCandidates = () => {
  const navigate = useNavigate();
  const [acceptedCandidates, setAcceptedCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false); // State for ResumePreview modal
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(""); // State for selected resume URL

  // Typing effect for search box placeholder
  const [placeholderText, setPlaceholderText] = useState("");
  const placeholderOptions = [
    "Search by name...",
    "Search by email...",
    "Search by gender...",
    "Search by DOB...",
    "Search by internship name...",
  ];

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

  // Fetch accepted candidates
  useEffect(() => {
    fetchAcceptedCandidates();
  }, []);

  const fetchAcceptedCandidates = async () => {
    try {
      const companyId = localStorage.getItem("company_id");
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}/applications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch accepted candidates");
      }

      const data = await response.json();
      const candidatesWithInternshipDetails = await Promise.all(
        data.data.accepted.map(async (candidate) => {
          const internshipResponse = await fetch(
            `${API_BASE_URL}/${candidate.internship_id}`
          );
          const internshipData = await internshipResponse.json();
          return {
            ...candidate,
            internship_name: internshipData.data.title || "N/A",
            internshipDetails: internshipData.data,
          };
        })
      );
      setAcceptedCandidates(candidatesWithInternshipDetails);
    } catch (error) {
      console.error("Error fetching accepted candidates:", error);
      setAcceptedCandidates([]);
    }
  };

  // Filter candidates based on search query
  const filteredCandidates = acceptedCandidates.filter((candidate) => {
    const query = searchQuery.toLowerCase();
    return (
      candidate.full_name.toLowerCase().includes(query) ||
      candidate.email.toLowerCase().includes(query) ||
      candidate.gender.toLowerCase().includes(query) ||
      candidate.dob.toLowerCase().includes(query) ||
      candidate.internship_name.toLowerCase().includes(query)
    );
  });

  const DetailItem = ({ label, value }) => (
    <Typography variant="body1">
      <strong style={{ color: "#6b7280" }}>{label}:</strong>{" "}
      <span style={{ color: "#1e40af" }}>{value}</span>
    </Typography>
  );

  const SocialLinkItem = ({ label, value }) => (
    <Typography variant="body1">
      <strong style={{ color: "#6b7280" }}>{label}:</strong>{" "}
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#3b82f6", textDecoration: "none" }}
      >
        {value}
      </a>
    </Typography>
  );

  // Handle opening the resume preview modal
  const handleResumePreviewOpen = (resumeUrl) => {
    setSelectedResumeUrl(resumeUrl);
    setResumePreviewOpen(true);
  };

  // Handle closing t8000he resume preview modal
  const handleResumePreviewClose = () => {
    setResumePreviewOpen(false);
    setSelectedResumeUrl("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <CompanyNavbar pageTitle="Selected Candidates" />
      <div className="flex-grow p-6 pb-12">
        {/* Page Title */}
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom sx={{ textAlign: "center" }}>
          Selected Candidates
        </Typography>

        {/* Search Box */}
        <div className="flex justify-center mb-8">
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

        {/* Table */}
        {filteredCandidates.length === 0 ? (
          <Typography variant="body1" className="text-gray-500" sx={{textAlign:"center"}}>
            No Candidates has been Selected or no candidates match the search criteria.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: "70vh", overflow: "auto", marginBottom: 4 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Phone
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Gender
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    DOB
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Internship Name
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate._id} hover sx={{ '&:hover': { backgroundColor: "#e0f7fa" } }}>
                    <TableCell>{candidate.full_name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.phone}</TableCell>
                    <TableCell>{candidate.gender}</TableCell>
                    <TableCell>{candidate.dob}</TableCell>
                    <TableCell>{candidate.internship_name}</TableCell>
                    <TableCell>{candidate.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Candidate Details Modal */}
        <Modal open={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "80%", md: "700px" },
              maxHeight: "80vh",
              bgcolor: "background.paper",
              background: "linear-gradient(145deg, #ffffff, #f3f4f6)",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
              p: { xs: 2, sm: 4 },
              borderRadius: "12px",
              overflowY: "auto",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {/* Close Button */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                cursor: "pointer",
                color: "#6b7280",
                "&:hover": {
                  color: "#3b82f6",
                },
              }}
              onClick={() => setIsDetailsModalOpen(false)}
            >
              <CloseIcon /> {/* Use the imported CloseIcon */}
            </Box>

            {/* Candidate Details Heading */}
            <Typography
              variant="h5"
              component="h2"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#3b82f6", textAlign: "center", mb: 3 }}
            >
              Candidate Details
            </Typography>

            {selectedCandidate ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Profile Image Section */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Avatar
                    src={selectedCandidate.profile_img} 
                    sx={{ width: 120, height: 120, border: "2px solid #3b82f6" }}
                  />
                </Box>

                {/* Personal Details Section */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "8px",
                    background: "#f9fafb",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#3b82f6", mb: 2 }}>
                    Personal Details
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <DetailItem label="Name" value={selectedCandidate.full_name} />
                    <DetailItem label="Email" value={selectedCandidate.email} />
                    <DetailItem label="Phone" value={selectedCandidate.phone} />
                    <DetailItem label="Gender" value={selectedCandidate.gender} />
                    <DetailItem label="DOB" value={selectedCandidate.dob} />
                  </Box>
                </Box>

                {/* Education Details Section */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "8px",
                    background: "#f9fafb",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#3b82f6", mb: 2 }}>
                    Education Details
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <DetailItem label="College" value={selectedCandidate.college} />
                    <DetailItem label="Department" value={selectedCandidate.department} />
                    <DetailItem
                      label="Registration Number"
                      value={selectedCandidate.registration_number}
                    />
                  </Box>
                </Box>

                {/* Location and About Section */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "8px",
                    background: "#f9fafb",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#3b82f6", mb: 2 }}>
                    Location & About
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <DetailItem label="Location" value={selectedCandidate.location} />
                    <DetailItem label="About" value={selectedCandidate.about} />
                  </Box>
                </Box>

                {/* Skills Section */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "8px",
                    background: "#f9fafb",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#3b82f6", mb: 2 }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedCandidate.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          backgroundColor: "#3b82f6",
                          color: "white",
                          borderRadius: "4px",
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Social Links Section */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "8px",
                    background: "#f9fafb",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#3b82f6", mb: 2 }}>
                    Social Links
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <SocialLinkItem
                      label="LinkedIn"
                      value={selectedCandidate.social_links.linkedin}
                    />
                    <SocialLinkItem
                      label="GitHub"
                      value={selectedCandidate.social_links.github}
                    />
                    <SocialLinkItem
                      label="Portfolio"
                      value={selectedCandidate.social_links.portfolio}
                    />
                  </Box>
                </Box>

                {/* Resume Section */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "8px",
                    background: "#f9fafb",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#3b82f6", mb: 2 }}>
                    Resume
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleResumePreviewOpen(selectedCandidate.resume_link)} 
                  >
                    View Resume
                  </Button>
                </Box>

                {/* Application Details Section */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "8px",
                    background: "#f9fafb",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#3b82f6", mb: 2 }}>
                    Application Details
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <DetailItem
                      label="Date Applied"
                      value={new Date(selectedCandidate.date_applied).toLocaleDateString()}
                    />
                    <DetailItem label="Status" value={selectedCandidate.status} />
                  </Box>
                </Box>

                {/* Applied Internship Details Section */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "8px",
                    background: "#f9fafb",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "#3b82f6", mb: 2 }}>
                    Applied Internship Details
                  </Typography>
                  {selectedCandidate.internshipDetails ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <DetailItem
                        label="Company Name"
                        value={selectedCandidate.internshipDetails.company_name}
                      />
                      <DetailItem
                        label="Internship Name"
                        value={selectedCandidate.internshipDetails.title}
                      />
                      <DetailItem
                        label="Domain"
                        value={selectedCandidate.internshipDetails.internship_domain}
                      />
                      <DetailItem
                        label="Duration"
                        value={selectedCandidate.internshipDetails.duration}
                      />
                      <DetailItem
                        label="Location"
                        value={selectedCandidate.internshipDetails.location}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body1">No internship details available.</Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Typography variant="body1">No details available.</Typography>
            )}
          </Box>
        </Modal>

        {/* Resume Preview Modal */}
        {resumePreviewOpen && (
          <ResumePreview
            resumeUrl={selectedResumeUrl}
            onClose={handleResumePreviewClose}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AcceptedCandidates;