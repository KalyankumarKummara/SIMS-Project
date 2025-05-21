import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import CompanyNavbar from "../components/CompanyNavbar"; // Import the Navbar
import Footer from "../components/Companyfooter"; // Import the Footer

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: "12px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
  color: "#000000", // Black text
  transition: "background 0.5s ease, box-shadow 0.5s ease",
  overflow: "hidden", // Prevent overflow
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ccc", // Light gray border
    },
    "&:hover fieldset": {
      borderColor: "#1976d2", // Blue border on hover
    },
    "& .MuiSelect-select": {
      color: "#000000", // Black text
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  fontWeight: "bold",
  background: "linear-gradient(45deg, #1976d2 30%, #dc004e 90%)", // Gradient button
  color: "#fff", // White text
  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "scale(1.03)", // Reduced scaling effect
    boxShadow: "0 5px 10px 2px rgba(0, 0, 0, 0.2)",
  },
}));

const UpdateApplicationStatus = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch application details on page load
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/applications/${applicationId}`
        );
        setApplication(response.data.data);
        setStatus(response.data.data.status);
      } catch (err) {
        setError("Failed to fetch application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  // Handle status update
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/applications/${applicationId}/status?status=${status}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/recruiter-dashboard");
        }, 3000);
      } else {
        setError("Failed to update status. Please try again.");
      }
    } catch (err) {
      setError("Failed to update status. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <CssBaseline /> 
      {/* Add the Company Navbar */}
      <CompanyNavbar pageTitle="Update Application Status" />

      {/* Main Content */}
      <Container maxWidth="md" sx={{mb:8}}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StyledPaper elevation={3}>
            <Box display="flex" alignItems="center" mb={4}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  mr: 2,
                  width: 56,
                  height: 56,
                  
                }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                sx={{ color: "#000000" }} // Black text
              >
                Update Application Status
              </Typography>
            </Box>

            <Box mb={4}>
              <Typography variant="body1" sx={{ color: "#000000" }}> {/* Black text */}
                Application ID: <strong>{applicationId}</strong>
              </Typography>
              <Typography variant="body1" sx={{ color: "#000000" }}> {/* Black text */}
                Student Name: <strong>{application?.full_name}</strong>
              </Typography>
              <Typography variant="body1" sx={{ color: "#000000" }}> {/* Black text */}
                Current Status:{" "}
                <Box
                  component="span"
                  sx={{
                    color:
                      application?.status === "accepted"
                        ? "success.main"
                        : application?.status === "rejected"
                        ? "error.main"
                        : "warning.main",
                    fontWeight: "bold",
                  }}
                >
                  {application?.status}
                </Box>
              </Typography>
            </Box>

            {isSuccess ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ color: "green", fontSize: "4rem" }} // Green tick
                >
                  ✅
                </Typography>
                <Typography variant="h6" sx={{ color: "green", mt: 2 }}>
                  Status updated successfully!
                </Typography>
              </Box>
            ) : (
              <form onSubmit={handleStatusUpdate}>
                <Box mb={2}>
                  <Typography variant="body1" sx={{ color: "#000000", fontWeight: "bold" }}> {/* Label above dropdown */}
                    New Status
                  </Typography>
                </Box>
                <StyledFormControl>
                  <Select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    sx={{
                      color: "#000000", // Black text
                    }}
                  >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="shortlisted">Shortlisted</MenuItem>
                  </Select>
                </StyledFormControl>

                <Box sx={{ overflow: "hidden", borderRadius: "8px" }}> 
                  <motion.div
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <StyledButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<CheckCircleIcon />}
                    >
                      Update Status
                    </StyledButton>
                  </motion.div>
                </Box>
              </form>
            )}

            {error && (
              <Box mt={3}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}
          </StyledPaper>
        </motion.div>
      </Container>

      {/* Add the Footer */}
      <Footer />
    </>
  );
};

export default UpdateApplicationStatus;