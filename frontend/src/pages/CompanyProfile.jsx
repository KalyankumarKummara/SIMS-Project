import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Work as WorkIcon,
  LinkedIn,
  Twitter,
  Facebook,
  Language,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CameraAlt as CameraIcon,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyNavbar from "../components/CompanyNavbar";
import Footer from "../components/Companyfooter";

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

const CompanyProfile = () => {
  const { company_id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8000/company-profile/${company_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status === "success") {
          setCompany(response.data.data);
          setEditedCompany(response.data.data);
        } else {
          setError("Company profile not found.");
        }
      } catch (err) {
        setError("Failed to fetch company profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [company_id]);

  const handleInputChange = (field, value) => {
    setEditedCompany((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setEditedCompany((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }));
  };

  const handleSave = async () => {
    // Phone validation
    if (editedCompany.phone && editedCompany.phone.length !== 10) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    const formData = new FormData();
    const socialLinks = editedCompany.social_links || {};

    // Append all fields
    Object.entries(editedCompany).forEach(([key, value]) => {
      if (key === 'social_links' || key === 'logo') return;
      if (value !== undefined) formData.append(key, value);
    });

    // Append social links
    Object.entries(socialLinks).forEach(([key, value]) => {
      formData.append(`social_links_${key}`, value || "");
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/company-profile/${company_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setCompany(response.data.data);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("remove_logo", "true"); 
  
      const response = await axios.put(
        `http://localhost:8000/company-profile/${company_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", 
          },
        }
      );
  
      if (response.data.status === "success") {
        setCompany((prev) => ({ ...prev, logo: null }));
        setIsImageModalOpen(false);
        toast.success("Logo removed successfully!");
  
        const fetchResponse = await axios.get(
          `http://localhost:8000/company-profile/${company_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (fetchResponse.data.status === "success") {
          setCompany(fetchResponse.data.data);
        }
      } else {
        toast.error("Failed to remove logo.");
      }
    } catch (err) {
      console.error("Error removing logo:", err);
      toast.error("Failed to remove logo.");
    }
  };
  const handleLogoChange = async (file) => {
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const tempUrl = URL.createObjectURL(file);
      setCompany(prev => ({ ...prev, logo: tempUrl }));

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/company-profile/${company_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setCompany(response.data.data);
        URL.revokeObjectURL(tempUrl);
        toast.success("Logo updated successfully!");
      }
    } catch (err) {
      setCompany(prev => ({ ...prev, logo: company?.logo }));
      toast.error("Failed to update logo.");
    }
    setIsImageModalOpen(false);
  };

  const renderLogoContent = (isModal = false) => {
    const hasLogo = company?.logo?.trim().length > 0;
    const fontSize = isModal ? "120px" : "48px";

    return hasLogo ? (
      <img
        src={company.logo}
        alt="Company Logo"
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
        {company?.name?.[0]?.toUpperCase() || "+"}
      </Typography>
    );
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
        <CircularProgress sx={{ animation: `${pulse} 1.5s infinite` }} />
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CompanyNavbar pageTitle="Company Profile" />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          color="primary"
          align="center"
          sx={{ mb: 4, animation: `${fadeIn} 0.8s ease-in` }}
        >
          Company Profile
        </Typography>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: "16px",
            background: "linear-gradient(145deg, #f3f4f6, #ffffff)",
            animation: `${fadeIn} 0.8s ease-in`,
          }}
        >
          <Box display="flex" alignItems="center" mb={4} flexDirection={{ xs: "column", sm: "row" }}  textAlign={{ xs: "center", sm: "left" }} >
            <Box
              sx={{
                position: "relative",
                width: { xs: 96, sm: 128 }, 
                height: { xs: 96, sm: 128 },
                borderRadius: "50%",
                overflow: "hidden",
                cursor: "pointer",
                backgroundColor: company?.logo ? "transparent" : "#e0e0e0",
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
              {renderLogoContent()}

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
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  zIndex: 2,
                }}
              >
                <EditIcon sx={{ color: "black", fontSize: { xs: 16, sm: 20 } }} />
              </Box>
            </Box>

            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="primary"
              sx={{ 
                mx: 2, 
                mt: { xs: 2, sm: 0 }, 
                textAlign: { xs: "center", sm: "left" } 
              }}
            >
              {company?.name}
            </Typography>
            <IconButton
              sx={{ ml: "auto", color: "primary.main" }}
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
                  Company Logo
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  A professional logo helps build brand recognition
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
                  {renderLogoContent(true)}

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
                    onClick={handleRemoveLogo}
                    sx={{ textTransform: "none" }}
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
                        if (file) handleLogoChange(file);
                      };
                      fileInput.click();
                    }}
                  >
                    Change Logo
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          <List>
            <ListItem sx={{ animation: `${fadeIn} 0.5s ease-in` }}>
              <EmailIcon sx={{ color: "primary.main", mr: 2, mt: 1 }} />
              <ListItemText
                primary="Email"
                secondary={
                  isEditing ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      value={editedCompany.email || ""}
                      disabled
                      InputProps={{ disableUnderline: true }}
                    />
                  ) : (
                    company?.email
                  )
                }
              />
            </ListItem>
            <Divider sx={{ my: 2 }} />

            <ListItem sx={{ animation: `${fadeIn} 0.6s ease-in` }}>
              <PhoneIcon sx={{ color: "primary.main", mr: 2, mt: 1 }} />
              <ListItemText
                primary="Phone"
                secondary={
                  isEditing ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      value={editedCompany.phone || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        handleInputChange("phone", value);
                      }}
                      error={editedCompany.phone?.length !== 10}
                      helperText={editedCompany.phone?.length !== 10 ? "Must be 10 digits" : ""}
                      InputProps={{
                        disableUnderline: true,
                        inputProps: { maxLength: 10 }
                      }}
                    />
                  ) : (
                    company?.phone
                  )
                }
              />
            </ListItem>
            <Divider sx={{ my: 2 }} />

            <ListItem sx={{ animation: `${fadeIn} 0.7s ease-in` }}>
              <WorkIcon sx={{ color: "primary.main", mr: 2, mt: 1 }} />
              <ListItemText
                primary="Industry"
                secondary={
                  isEditing ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      value={editedCompany.industry || ""}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                      InputProps={{ disableUnderline: true }}
                    />
                  ) : (
                    company?.industry
                  )
                }
              />
            </ListItem>
            <Divider sx={{ my: 2 }} />

            <ListItem sx={{ animation: `${fadeIn} 0.8s ease-in` }}>
              <LocationIcon sx={{ color: "primary.main", mr: 2, mt: 1 }} />
              <ListItemText
                primary="Location"
                secondary={
                  isEditing ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      value={editedCompany.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      InputProps={{ disableUnderline: true }}
                    />
                  ) : (
                    company?.location
                  )
                }
              />
            </ListItem>
            <Divider sx={{ my: 2 }} />

            <ListItem sx={{ animation: `${fadeIn} 0.9s ease-in` }}>
              <PeopleIcon sx={{ color: "primary.main", mr: 2, mt: 1 }} />
              <ListItemText
                primary="Company Size"
                secondary={
                  isEditing ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      value={editedCompany.size || ""}
                      onChange={(e) => handleInputChange("size", e.target.value)}
                      InputProps={{ disableUnderline: true }}
                    />
                  ) : (
                    company?.size
                  )
                }
              />
            </ListItem>
            <Divider sx={{ my: 2 }} />

            <ListItem sx={{ animation: `${fadeIn} 1s ease-in` }}>
              <DescriptionIcon sx={{ color: "primary.main", mr: 2, mt: 1 }} />
              <ListItemText
                primary="Description"
                secondary={
                  isEditing ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      value={editedCompany.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      multiline
                      rows={4}
                      InputProps={{ disableUnderline: true }}
                    />
                  ) : (
                    company?.description
                  )
                }
              />
            </ListItem>
            <Divider sx={{ my: 2 }} />
            <ListItem sx={{ animation: `${fadeIn} 1.2s ease-in` }}>
              <LinkedIn sx={{ color: "primary.main", mr: 2, mt: 1 }} />
              <ListItemText
                primary="LinkedIn"
                secondary={
                  isEditing ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      value={editedCompany.social_links?.linkedin || ""}
                      onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                      InputProps={{ disableUnderline: true }}
                    />
                  ) : (
                    <Link href={company?.social_links?.linkedin} target="_blank" rel="noopener">
                      {company?.social_links?.linkedin}
                    </Link>
                  )
                }
              />
            </ListItem>
            <Divider sx={{ my: 2 }} />

            <ListItem sx={{ animation: `${fadeIn} 1.3s ease-in` }}>
              <Twitter sx={{ color: "primary.main", mr: 2, mt: 1 }} />
              <ListItemText
                primary="Twitter"
                secondary={
                  isEditing ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      value={editedCompany.social_links?.twitter || ""}
                      onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                      InputProps={{ disableUnderline: true }}
                    />
                  ) : (
                    <Link href={company?.social_links?.twitter} target="_blank" rel="noopener">
                      {company?.social_links?.twitter}
                    </Link>
                  )
                }
              />
            </ListItem>
            <Divider sx={{ my: 2 }} />

            <ListItem sx={{ animation: `${fadeIn} 1.4s ease-in` }}>
              <Facebook sx={{ color: "primary.main", mr: 2, mt: 1 }} />
              <ListItemText
                primary="Facebook"
                secondary={
                  isEditing ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      value={editedCompany.social_links?.facebook || ""}
                      onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                      InputProps={{ disableUnderline: true }}
                    />
                  ) : (
                    <Link href={company?.social_links?.facebook} target="_blank" rel="noopener">
                      {company?.social_links?.facebook}
                    </Link>
                  )
                }
              />
            </ListItem>
            <Divider sx={{ my: 2 }} />

            <ListItem sx={{ animation: `${fadeIn} 1.5s ease-in` }}>
              <Language sx={{ color: "primary.main", mr: 2, mt: 1 }} />
              <ListItemText
                primary="Website"
                secondary={
                  isEditing ? (
                    <TextField
                      fullWidth
                      variant="standard"
                      value={editedCompany.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      InputProps={{ disableUnderline: true }}
                    />
                  ) : (
                    <Link href={company?.website} target="_blank" rel="noopener">
                      {company?.website}
                    </Link>
                  )
                }
              />
            </ListItem>
            <Divider sx={{ my: 2 }} />
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
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Footer />
    </Box>
  );
};

export default CompanyProfile;