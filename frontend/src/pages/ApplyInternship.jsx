import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaUniversity,
  FaGraduationCap,
  FaIdBadge,
  FaInfoCircle,
  FaCode,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaFilePdf,
} from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Modal, Box, Typography, IconButton } from "@mui/material";
import { Close, NavigateBefore, NavigateNext } from "@mui/icons-material";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import StudentDashboardNavbar from '../components/StudentNavbar';
import Footer from "../components/Studentfooter";

// ResumePreview Component
const ResumePreview = ({ resumeUrl, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  const updateContainerWidth = () => {
    const width = Math.min(window.innerWidth * 0.9, 1200);
    setContainerWidth(width);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Modal open={true} onClose={onClose} sx={{ backdropFilter: "blur(3px)" }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "1200px",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "12px",
          outline: "none",
          display: "flex",
          flexDirection: "column",
          maxHeight: "95vh",
        }}
      >
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #eee",
          background: theme => theme.palette.primary.main,
          color: "white",
          borderRadius: "12px 12px 0 0"
        }}>
          <Typography variant="h6" component="h2">
            Resume Preview
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ 
          flex: 1,
          overflowY: "auto",
          p: 2,
          position: "relative",
          '& .react-pdf__Page': {
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
            margin: "0 auto"
          }
        }}>
          <Document 
            file={resumeUrl} 
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <Box sx={{ 
                height: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Typography>Loading PDF...</Typography>
              </Box>
            }
          >
            <Page 
              pageNumber={pageNumber}
              width={containerWidth * 0.85}
              renderAnnotationLayer={false}
              renderTextLayer={true}
              loading={null}
            />
          </Document>
        </Box>

        <Box sx={{
          p: 2,
          borderTop: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8f9fa"
        }}>
          <Button
            variant="contained"
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            startIcon={<NavigateBefore />}
            sx={{ textTransform: "none" }}
          >
            Previous
          </Button>
          
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Page {pageNumber} of {numPages || "..."}
          </Typography>

          <Button
            variant="contained"
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
            disabled={pageNumber >= (numPages || 1)}
            endIcon={<NavigateNext />}
            sx={{ textTransform: "none" }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// ApplyInternship Component
const ApplyInternship = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const studentId = localStorage.getItem("student_id");
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!studentId || !token || role !== "student") {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/student-profile/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok && data.status === "success") {
          setStudent(data.data);
          checkProfileCompletion(data.data);
        } else {
          setError(data.message || "Failed to fetch student details");
        }
      } catch (error) {
        setError("An error occurred while fetching student details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [navigate]);

  const checkProfileCompletion = (studentData) => {
    const requiredFields = [
      'name', 'email', 'phone', 'dob', 'gender', 'location',
      'college', 'department', 'registration_number', 'skills',
      'resume_link', 'about'
    ];
    
    const missing = requiredFields.filter(field => {
      if (field === 'skills') return !studentData[field] || studentData[field].length === 0;
      return !studentData[field];
    });

    setMissingFields(missing);
    setProfileComplete(missing.length === 0);
  };

  const handleApply = async () => {
    if (!profileComplete) {
      setError("Please complete your profile before applying");
      return;
    }

    if (!student) {
      setError("Student details are missing.");
      return;
    }

    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("student_id");

    try {
      const payload = {
        student_id: studentId,
        college: student.college || "",
        department: student.department || "",
        registration_number: student.registration_number || "",
        phone: student.phone || "",
        full_name: student.name || "",
        email: student.email || "",
        about: student.about || "",
        dob: new Date(student.dob).toISOString().split("T")[0],
        gender: student.gender || "",
        location: student.location || "",
        skills: student.skills || [],
        social_links: student.social_links || {},
        profile_img: student.profile_img || null, // Changed to allow null
        resume_link: student.resume_link || "",
        date_applied: new Date().toISOString(),
        status: "pending",
      };

      const url = `http://localhost:8000/applications/?internship_id=${internshipId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.status === "failed" && data.message === "You have already applied for this internship") {
        setAlreadyApplied(true);
        return;
      }

      if (response.ok && data.status === "success") {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/student-dashboard");
        }, 3000);
      } else {
        throw new Error(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Application Error:", error.message);
      setApplicationStatus("failed");
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");
    const formattedYear = year;
    return `${formattedDay}-${formattedMonth}-${formattedYear}`;
  };

  if (alreadyApplied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center"
        >
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Already Applied
          </h2>
          <p className="text-red-600 mb-6">
            You have already applied for this internship.
          </p>
          <button
            onClick={() => navigate("/student-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center"
        >
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your internship application has been received.
          </p>
          <button
            onClick={() => navigate("/student-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-r from-blue-50 to-purple-50">
        <div>
          <StudentDashboardNavbar pageTitle="Apply Internship" />
          <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-160px)]">
            <p className="text-center text-gray-500">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <StudentDashboardNavbar pageTitle="Apply Internship" />
        <div className="max-w-4xl mx-auto p-4">
          <p className="text-center text-red-500">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
        <StudentDashboardNavbar pageTitle="Apply Internship" />
        <div className="max-w-4xl mx-auto p-4">
          <p className="text-center text-gray-500">No student details found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <StudentDashboardNavbar pageTitle="Apply Internship" />

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden mt-4 mb-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Apply Internship</h1>
          <div className="flex items-center gap-4">
            {student.profile_img ? (
              <div className="rounded-full overflow-hidden border-2 border-white w-12 h-12">
                <img
                  src={student.profile_img}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="rounded-full overflow-hidden border-2 border-white w-12 h-12 bg-gray-200 flex items-center justify-center">
                <FaUser className="text-gray-500 text-xl" />
              </div>
            )}
          </div>
        </div>

        {applicationStatus === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg mx-6 mt-6"
          >
            <FaTimesCircle className="text-red-400 mr-2" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {!profileComplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-yellow-50 border-l-4 border-yellow-400"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaInfoCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800">
                  Complete Your Profile
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You need to complete your profile before applying for internships.
                    The following fields are missing:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {missingFields.map((field, index) => (
                      <li key={index} className="capitalize">
                        {field.replace(/_/g, ' ')}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <button
                      onClick={() => navigate('/student/profile')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Complete Profile Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {profileComplete && (
          <>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="text-blue-600 mr-2" /> Personal Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    {student.profile_img ? (
                      <img
                        src={student.profile_img}
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    ) : (
                      <FaUser className="text-blue-600 mr-2" />
                    )}
                    <p className="text-gray-600 font-semibold">Full Name</p>
                  </div>
                  <p className="text-gray-800">{student.name}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <FaFilePdf className="text-blue-600 mr-2" />
                    <p className="text-gray-600 font-semibold">Resume</p>
                  </div>
                  <button
                    onClick={() => setShowResumePreview(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    <FaFilePdf className="mr-2" />
                    View Resume
                  </button>
                  {showResumePreview && (
                    <ResumePreview
                      resumeUrl={student.resume_link}
                      onClose={() => setShowResumePreview(false)}
                    />
                  )}
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-blue-600 mr-2" />
                    <p className="text-gray-600 font-semibold">Email</p>
                  </div>
                  <p className="text-gray-800">{student.email}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <FaPhone className="text-blue-600 mr-2" />
                    <p className="text-gray-600 font-semibold">Phone</p>
                  </div>
                  <p className="text-gray-800">{student.phone}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <FaBirthdayCake className="text-blue-600 mr-2" />
                    <p className="text-gray-600 font-semibold">Date of Birth</p>
                  </div>
                  <p className="text-gray-800">{formatDate(student.dob)}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <FaUser className="text-blue-600 mr-2" />
                    <p className="text-gray-600 font-semibold">Gender</p>
                  </div>
                  <p className="text-gray-800">{student.gender}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-blue-600 mr-2" />
                    <p className="text-gray-600 font-semibold">Location</p>
                  </div>
                  <p className="text-gray-800">{student.location}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <FaUniversity className="text-blue-600 mr-2" />
                    <p className="text-gray-600 font-semibold">College</p>
                  </div>
                  <p className="text-gray-800">{student.college}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <FaGraduationCap className="text-blue-600 mr-2" />
                    <p className="text-gray-600 font-semibold">Department</p>
                  </div>
                  <p className="text-gray-800">{student.department}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <FaIdBadge className="text-blue-600 mr-2" />
                    <p className="text-gray-600 font-semibold">Registration Number</p>
                  </div>
                  <p className="text-gray-800">{student.registration_number}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-lg col-span-full"
                >
                  <div className="flex items-center mb-2">
                    <FaInfoCircle className="text-blue-600 mr-2" />
                    <p className="text-gray-600 font-semibold">About</p>
                  </div>
                  <p className="text-gray-800">{student.about}</p>
                </motion.div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaCode className="text-blue-600 mr-2" /> Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaGlobe className="text-blue-600 mr-2" /> Social Links
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(student.social_links).map(([platform, link]) => (
                  <motion.div
                    key={platform}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-50 p-4 rounded-lg break-words"
                  >
                    <div className="flex items-center mb-2">
                      {platform === "linkedin" && <FaLinkedin className="text-blue-600 mr-2" />}
                      {platform === "github" && <FaGithub className="text-blue-600 mr-2" />}
                      {platform === "portfolio" && <FaGlobe className="text-blue-600 mr-2" />}
                      <p className="text-gray-600 font-semibold capitalize">{platform}</p>
                    </div>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      style={{ wordBreak: 'break-all' }}
                    >
                      {link}
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApply}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Submit Application
              </motion.button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ApplyInternship;