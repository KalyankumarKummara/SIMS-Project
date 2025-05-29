import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useMediaQuery,
  Box,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { AccountCircle, ExitToApp, Notifications, Menu as MenuIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import simsLogo from "../assets/sims-logo.jpg"; // Import the logo
import axios from "axios"; // For API calls

const StudentDashboardNavbar = ({ pageTitle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery((theme) => theme.breakpoints.between("sm", "md"));
  const navigate = useNavigate();

  // Fetch student profile data (including profile image)
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const studentId = localStorage.getItem("student_id");
        const response = await axios.get(`${API_BASE_URL}/student-profile/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "success") {
          setProfileImage(response.data.data.profile_img); // Set profile image URL
        } else {
          setError("Failed to fetch profile data.");
        }
      } catch (err) {
        setError("Failed to fetch profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student_id");
    navigate("/login");
  };

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => navigate("/internship/internship-list")}>
        Available Internships
      </MenuItem>
      <MenuItem onClick={() => navigate("/applied-internships")}>
        Applied Internships
      </MenuItem>
      <MenuItem onClick={() => navigate("/saved-internships")}>
        Saved Internships
      </MenuItem>
      <MenuItem onClick={() => navigate("/notifications")}>
        <Notifications sx={{ marginRight: 1 }} />
        Notifications
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="sticky"
      sx={{ backgroundColor: "#3b82f6", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
    >
      <Toolbar>
        {/* Styled SIMS Logo */}
        <Box
          component="img"
          src={simsLogo}
          alt="SIMS Logo"
          sx={{
            height: 50,
            width: 50,
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            objectFit: "cover",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            marginRight: 1,
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.3)",
            },
          }}
        />

        {/* Page Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          {pageTitle}
        </Typography>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={handleMobileMenuOpen}>
              <MenuIcon />
            </IconButton>
            {renderMobileMenu}
          </>
        ) : (
          <>
            <Button
              color="inherit"
              component={Link}
              to="/internship/internship-list"
              sx={{
                marginRight: 2,
                fontWeight: pageTitle === "Available Internships" ? "bold" : "normal",
                backgroundColor: pageTitle === "Available Internships" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                borderRadius: "4px",
                padding: isTablet ? "4px 8px" : "6px 12px",
                fontSize: isTablet ? "0.875rem" : "1rem",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Available Internships
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/applied-internships"
              sx={{
                marginRight: 2,
                fontWeight: pageTitle === "Applied Internships" ? "bold" : "normal",
                backgroundColor: pageTitle === "Applied Internships" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                borderRadius: "4px",
                padding: isTablet ? "4px 8px" : "6px 12px",
                fontSize: isTablet ? "0.875rem" : "1rem",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Applied Internships
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/saved-internships"
              sx={{
                marginRight: 2,
                fontWeight: pageTitle === "Saved Internships" ? "bold" : "normal",
                backgroundColor: pageTitle === "Saved Internships" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                borderRadius: "4px",
                padding: isTablet ? "4px 8px" : "6px 12px",
                fontSize: isTablet ? "0.875rem" : "1rem",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Saved Internships
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/notifications"
              sx={{
                marginRight: 2,
                fontWeight: pageTitle === "Notifications" ? "bold" : "normal",
                backgroundColor: pageTitle === "Notifications" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                borderRadius: "4px",
                padding: isTablet ? "4px 8px" : "6px 12px",
                fontSize: isTablet ? "0.875rem" : "1rem",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Notifications sx={{ marginRight: isTablet ? 0 : 1, fontSize: isTablet ? "1.5rem" : "1.25rem" }} />
              {isTablet ? null : "Notifications"}
            </Button>
          </>
        )}

        {/* Profile Icon with Image */}
        <IconButton color="inherit" onClick={handleMenuOpen}>
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : profileImage ? (
            <Avatar src={profileImage} sx={{ width: 32, height: 32 }} />
          ) : (
            <AccountCircle sx={{ fontSize: isTablet ? "28px" : "32px" }} />
          )}
        </IconButton>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            sx: {
              padding: "8px",
            },
          }}
        >
          <MenuItem onClick={() => navigate(`/student-profile/${localStorage.getItem("student_id")}`)}>
            {profileImage ? (
              <Avatar src={profileImage} sx={{ width: 24, height: 24, marginRight: "8px" }} />
            ) : (
              <AccountCircle sx={{ marginRight: "8px" }} />
            )}
            My Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ExitToApp sx={{ marginRight: "8px" }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default StudentDashboardNavbar;