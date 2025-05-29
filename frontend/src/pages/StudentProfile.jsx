import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../config";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  Divider,
  Link,
  TextField,
  Button,
  IconButton,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Transgender as TransgenderIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  LinkedIn,
  GitHub,
  Language,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CameraAlt as CameraIcon,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentDashboardNavbar from "../components/StudentNavbar";
import Footer from "../components/Studentfooter";
import ResumePreview from "../components/ResumePreview"; 

// Custom Theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#d32f2f",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h4: {
      fontWeight: 600,
    },
  },
});

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const StudentProfile = () => {
  const { student_id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false); // State for resume preview modal
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/student-profile/${student_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status === "success") {
          setStudent(response.data.data);
          setEditedStudent(response.data.data);
        } else {
          setError("Student profile not found.");
        }
      } catch (err) {
        setError("Failed to fetch student profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [student_id]);

  const handleInputChange = (field, value) => {
    setEditedStudent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // Phone number validation
    if (editedStudent.phone && editedStudent.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      if (editedStudent.name) formData.append("name", editedStudent.name);
      if (editedStudent.email) formData.append("email", editedStudent.email);
      if (editedStudent.phone) formData.append("phone", editedStudent.phone);
      if (editedStudent.dob) formData.append("dob", editedStudent.dob);
      if (editedStudent.gender) formData.append("gender", editedStudent.gender);
      if (editedStudent.college) formData.append("college", editedStudent.college);
      if (editedStudent.department) formData.append("department", editedStudent.department);
      if (editedStudent.registration_number) formData.append("registration_number", editedStudent.registration_number);
      if (editedStudent.location) formData.append("location", editedStudent.location);
      if (editedStudent.about) formData.append("about", editedStudent.about);
      if (editedStudent.resume_link) formData.append("resume_link", editedStudent.resume_link);

      if (editedStudent.skills) {
        editedStudent.skills.forEach((skill) => {
          formData.append("skills", skill);
        });
      }

      const socialLinks = editedStudent.social_links || {};
      if (socialLinks.linkedin) formData.append("social_links_linkedin", socialLinks.linkedin);
      if (socialLinks.github) formData.append("social_links_github", socialLinks.github);
      if (socialLinks.portfolio) formData.append("social_links_portfolio", socialLinks.portfolio);

      const response = await axios.put(
        `${API_BASE_URL}/student-profile/${student_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setStudent(response.data.data);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  const handleRemoveImage = async () => {
    const formData = new FormData();
    formData.append("remove_profile_img", "true");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/student-profile/${student_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setStudent(response.data.data);
        setIsImageModalOpen(false);
        toast.success("Profile image removed successfully!");
      } else {
        toast.error("Failed to remove profile image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove profile image.");
    }
  };

  const handleChangeImage = async (file) => {
    try {
      const tempUrl = URL.createObjectURL(file);
      setStudent(prev => ({ ...prev, profile_img: tempUrl }));

      const formData = new FormData();
      formData.append("profile_img", file);

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/student-profile/${student_id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      if (response.data.status === "success") {
        setStudent(response.data.data);
        URL.revokeObjectURL(tempUrl);
      }

      setIsImageModalOpen(false);
      toast.success("Profile image updated successfully!");
    } catch (err) {
      setStudent(prev => ({ ...prev, profile_img: student?.profile_img }));
      toast.error("Failed to update profile image.");
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
        <CircularProgress sx={{ animation: `${rotate} 1s linear infinite, ${pulse} 1.5s infinite` }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ animation: `${fadeIn} 0.5s ease-in` }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const renderProfileContent = (isModal = false) => {
    const hasImage = student?.profile_img?.trim().length > 0;
    const fontSize = isModal ? "120px" : "48px";

    return hasImage ? (
      <img
        src={student.profile_img}
        alt="Profile"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      <Typography
        variant="h1"
        sx={{
          color: "#757575",
          fontSize: fontSize,
          fontWeight: "bold",
          userSelect: "none",
        }}
      >
        {student?.name?.[0]?.toUpperCase() || "+"}
      </Typography>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <StudentDashboardNavbar pageTitle="Student Profile" />

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          color="primary"
          textAlign="center"
          sx={{
            mb: 4,
            animation: `${fadeIn} 0.8s ease-in`,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Student Profile
        </Typography>
        <Paper
          elevation={6}
          sx={{
            p: isMobile ? 2 : 4,
            borderRadius: "16px",
            background: "linear-gradient(145deg, #ffffff, #f3f4f6)",
            animation: `${fadeIn} 0.8s ease-in`,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box display="flex" alignItems="center" mb={4} flexDirection={isMobile ? "column" : "row"}>
            <Box
              sx={{
                position: "relative",
                width: 96,
                height: 96,
                borderRadius: "50%",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: student?.profile_img ? "transparent" : "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                  },
                  "& .edit-overlay": {
                    opacity: 1,
                  },
                },
              }}
              onClick={() => setIsImageModalOpen(true)}
            >
              {renderProfileContent()}

              <Box
                className="edit-overlay"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                }}
              >
                <CameraIcon sx={{ color: "white", fontSize: 32 }} />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "white",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  zIndex: 2,
                }}
              >
                <EditIcon sx={{ color: "black", fontSize: 20 }} />
              </Box>
            </Box>

            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="primary"
              textAlign={isMobile ? "center" : "left"}
              sx={{ mx: 2 }}
            >
              {student?.name}
            </Typography>
            <IconButton
              sx={{ ml: "auto", color: "primary.main", "&:hover": { transform: "scale(1.1)" } }}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <SaveIcon fontSize="large" /> : <EditIcon fontSize="large" />}
            </IconButton>
          </Box>

          {isImageModalOpen && (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
              onClick={() => setIsImageModalOpen(false)}
            >
              <Box
                sx={{
                  width: "400px",
                  maxWidth: "90%",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  p: 3,
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    color: "#5f6368",
                  }}
                  onClick={() => setIsImageModalOpen(false)}
                >
                  <CloseIcon />
                </IconButton>

                <Typography variant="h6" gutterBottom>
                  Profile picture
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  A picture helps people recognize you and lets you know when you're signed in to your account
                </Typography>

                <Box
                  sx={{
                    position: "relative",
                    width: 288,
                    height: 288,
                    mx: "auto",
                    my: 3,
                    borderRadius: "50%",
                    overflow: "hidden",
                    backgroundColor: "#e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {renderProfileContent(true)}

                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                      },
                    }}
                    onClick={() => setIsImageModalOpen(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ textTransform: "none" }}
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: "none" }}
                    onClick={() => {
                      const fileInput = document.createElement("input");
                      fileInput.type = "file";
                      fileInput.accept = "image/*";
                      fileInput.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) handleChangeImage(file);
                      };
                      fileInput.click();
                    }}
                  >
                    Change picture
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          <List>
            <ListItem sx={{ animation: `${slideIn} 0.5s ease-in`, display: "flex", alignItems: "center" }}>
              <PersonIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  Name
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.name || ""}
                    disabled
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {student?.name}
                  </Typography>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 0.6s ease-in`, display: "flex", alignItems: "center" }}>
              <EmailIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  Email
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.email || ""}
                    disabled
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {student?.email}
                  </Typography>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 0.7s ease-in`, display: "flex", alignItems: "center" }}>
              <PhoneIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  Phone
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.phone || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      handleInputChange("phone", value);
                    }}
                    error={editedStudent.phone?.length !== 10}
                    helperText={editedStudent.phone?.length !== 10 ? "Phone must be 10 digits" : ""}
                    InputProps={{
                      disableUnderline: true,
                      inputProps: {
                        maxLength: 10
                      }
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {student?.phone}
                  </Typography>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 0.8s ease-in`, display: "flex", alignItems: "center" }}>
              <CakeIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  Date of Birth
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.dob || ""}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {student?.dob}
                  </Typography>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 0.9s ease-in`, display: "flex", alignItems: "center" }}>
              <TransgenderIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  Gender
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.gender || ""}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {student?.gender}
                  </Typography>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 1s ease-in`, display: "flex", alignItems: "center" }}>
              <SchoolIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  College
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.college || ""}
                    onChange={(e) => handleInputChange("college", e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {student?.college}
                  </Typography>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 1.1s ease-in`, display: "flex", alignItems: "center" }}>
              <WorkIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  Department
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.department || ""}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {student?.department}
                  </Typography>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 1.2s ease-in`, display: "flex", alignItems: "center" }}>
              <SchoolIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  Registration Number
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.registration_number || ""}
                    onChange={(e) => handleInputChange("registration_number", e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {student?.registration_number}
                  </Typography>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 1.3s ease-in`, display: "flex", alignItems: "center" }}>
              <LocationIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  Location
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.location || ""}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {student?.location}
                  </Typography>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 1.4s ease-in`, display: "flex", alignItems: "center" }}>
              <DescriptionIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  About
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.about || ""}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                    InputProps={{ disableUnderline: true }}
                    multiline
                    rows={4}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {student?.about}
                  </Typography>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 1.5s ease-in`, display: "flex", alignItems: "center" }}>
              <CodeIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  Skills
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.skills?.join(", ") || ""}
                    onChange={(e) => handleInputChange("skills", e.target.value.split(", "))}
                    InputProps={{ disableUnderline: true }}
                    multiline
                    rows={4}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {student?.skills?.join(", ")}
                  </Typography>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 1.6s ease-in`, display: "flex", alignItems: "center" }}>
              <LinkedIn sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  LinkedIn
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.social_links?.linkedin || ""}
                    onChange={(e) => handleInputChange("social_links", { ...editedStudent.social_links, linkedin: e.target.value })}
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  <Link
                    href={student?.social_links?.linkedin}
                    target="_blank"
                    rel="noopener"
                    sx={{
                      wordBreak: "break-all",
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {student?.social_links?.linkedin}
                  </Link>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 1.7s ease-in`, display: "flex", alignItems: "center" }}>
              <GitHub sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  GitHub
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.social_links?.github || ""}
                    onChange={(e) => handleInputChange("social_links", { ...editedStudent.social_links, github: e.target.value })}
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  <Link
                    href={student?.social_links?.github}
                    target="_blank"
                    rel="noopener"
                    sx={{
                      wordBreak: "break-all",
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {student?.social_links?.github}
                  </Link>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 1.8s ease-in`, display: "flex", alignItems: "center" }}>
              <Language sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  Portfolio
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.social_links?.portfolio || ""}
                    onChange={(e) => handleInputChange("social_links", { ...editedStudent.social_links, portfolio: e.target.value })}
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  student?.social_links?.portfolio ? (
                    <Link
                      href={student?.social_links?.portfolio}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        wordBreak: "break-all",
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {student?.social_links?.portfolio}
                    </Link>
                  ) : (
                    "Not provided"
                  )
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />

            <ListItem sx={{ animation: `${slideIn} 1.9s ease-in`, display: "flex", alignItems: "center" }}>
              <DescriptionIcon sx={{ color: "primary.main", mr: 2, alignSelf: "flex-start", mt: 1 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" color="text.primary">
                  Resume
                </Typography>
                {isEditing ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedStudent.resume_link || ""}
                    onChange={(e) => handleInputChange("resume_link", e.target.value)}
                    InputProps={{ disableUnderline: true }}
                  />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsResumePreviewOpen(true)}
                  >
                    View Resume
                  </Button>
                )}
              </Box>
            </ListItem>
            <Divider sx={{ my: 2, bgcolor: "primary.main", opacity: 0.2 }} />
          </List>

          {isEditing && (
            <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  animation: `${fadeIn} 0.5s ease-in`,
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Resume Preview Modal */}
      {isResumePreviewOpen && (
        <ResumePreview
          resumeUrl={student?.resume_link}
          onClose={() => setIsResumePreviewOpen(false)}
        />
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
      <Footer />
    </ThemeProvider>
  );
};

export default StudentProfile;