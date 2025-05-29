import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API_BASE_URL from "../config";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  PostAdd as PostAddIcon,
  ManageAccounts as ManageAccountsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  ListAlt as ListAltIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import simsLogo from "../assets/sims-logo.jpg";
import axios from "axios";

const CompanyNavbar = ({ pageTitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null); // State to store company logo

  // Fetch company logo from localStorage or API
  useEffect(() => {
    const fetchCompanyLogo = async () => {
      const companyId = localStorage.getItem("company_id");
      if (companyId) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${API_BASE_URL}/company-profile/${companyId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Company Profile Response:", response.data); // Debugging
          if (response.data.status === "success" && response.data.data.logo) {
            setCompanyLogo(response.data.data.logo); // Set company logo if available
          }
        } catch (err) {
          console.error("Failed to fetch company logo:", err);
        }
      }
    };

    fetchCompanyLogo();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Fetch company_id from localStorage
  const companyId = localStorage.getItem("company_id");

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(45deg, #6a11cb, #2575fc)", // Gradient from purple to blue
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar>
        {/* SIMS Logo */}
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

        {/* Page Title on the Left Side */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold", color: "#ffffff" }}>
          {pageTitle}
        </Typography>

        {/* Navigation Links (Desktop) */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Post Internship Link */}
            <Button
              component={Link}
              to="/internship/post"
              startIcon={<PostAddIcon />}
              sx={{
                color: "white",
                fontWeight: pageTitle === "Post Internship" ? "bold" : "normal",
                backgroundColor: pageTitle === "Post Internship" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                borderRadius: "4px",
                padding: "6px 12px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Post Internship
            </Button>

            {/* Manage Internship Link */}
            <Button
              component={Link}
              to="/manage-internships"
              startIcon={<ManageAccountsIcon />}
              sx={{
                color: "white",
                fontWeight: pageTitle === "Manage Internship" ? "bold" : "normal",
                backgroundColor: pageTitle === "Manage Internship" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                borderRadius: "4px",
                padding: "6px 12px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Manage Internship
            </Button>

            {/* Shortlisted Candidates Link */}
            <Button
              component={Link}
              to="/recruiter/shortlisted-candidates"
              startIcon={<ListAltIcon />}
              sx={{
                color: "white",
                fontWeight: pageTitle === "Shortlisted Candidates" ? "bold" : "normal",
                backgroundColor: pageTitle === "Shortlisted Candidates" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                borderRadius: "4px",
                padding: "6px 12px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Shortlisted Candidates
            </Button>

            {/* Accepted Candidates Link */}
            <Button
              component={Link}
              to="/recruiter/accepted-candidates"
              startIcon={<CheckCircleIcon />}
              sx={{
                color: "white",
                fontWeight: pageTitle === "Accepted Candidates" ? "bold" : "normal",
                backgroundColor: pageTitle === "Accepted Candidates" ? "rgba(255, 255, 255, 0.2)" : "transparent",
                borderRadius: "4px",
                padding: "6px 12px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Selected Candidates
            </Button>
          </Box>
        )}

        {/* Profile Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto" }}>
          {/* Profile Avatar and Menu */}
          <IconButton
            size="large"
            aria-label="profile"
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
          >
            <Avatar sx={{ width: 32, height: 32, backgroundColor: "#ffffff", color: "#6a11cb" }}>
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    setCompanyLogo(null); // Fallback to icon if image fails to load
                  }}
                />
              ) : (
                <AccountCircleIcon />
              )}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: 200,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                background: "linear-gradient(45deg, #6a11cb, #2575fc)", // Gradient for the menu
                color: "#ffffff",
              },
            }}
          >
            {/* Profile Link with Company Logo */}
            <MenuItem
              onClick={() => navigate(`/company-profile/${companyId}`)}
              sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
            >
              <ListItemIcon>
                {companyLogo ? (
                  <Avatar
                    src={companyLogo}
                    sx={{ width: 24, height: 24, backgroundColor: "#ffffff" }}
                  />
                ) : (
                  <AccountCircleIcon fontSize="small" sx={{ color: "#ffffff" }} />
                )}
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />

            {/* Logout Link */}
            <MenuItem
              onClick={handleLogout}
              sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Menu */}
      {isMobile && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              width: "100%",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              background: "linear-gradient(45deg, #6a11cb, #2575fc)", // Gradient for the mobile menu
              color: "#ffffff",
            },
          }}
        >
          {/* Post Internship Link */}
          <MenuItem
            onClick={() => navigate("/internship/post")}
            sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
          >
            <ListItemIcon>
              <PostAddIcon fontSize="small" sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Post Internship" />
          </MenuItem>

          {/* Manage Internship Link */}
          <MenuItem
            onClick={() => navigate("/manage-internships")}
            sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
          >
            <ListItemIcon>
              <ManageAccountsIcon fontSize="small" sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Manage Internship" />
          </MenuItem>

          {/* Shortlisted Candidates Link */}
          <MenuItem
            onClick={() => navigate("/recruiter/shortlisted-candidates")}
            sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
          >
            <ListItemIcon>
              <ListAltIcon fontSize="small" sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Shortlisted Candidates" />
          </MenuItem>

          {/* Accepted Candidates Link */}
          <MenuItem
            onClick={() => navigate("/recruiter/accepted-candidates")}
            sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
          >
            <ListItemIcon>
              <CheckCircleIcon fontSize="small" sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Selected Candidates" />
          </MenuItem>
          <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />

          {/* Profile Link */}
          <MenuItem
            onClick={() => navigate(`/company-profile/${companyId}`)}
            sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
          >
            <ListItemIcon>
              {companyLogo ? (
                <Avatar
                  src={companyLogo}
                  sx={{ width: 24, height: 24, backgroundColor: "#ffffff" }}
                />
              ) : (
                <AccountCircleIcon fontSize="small" sx={{ color: "#ffffff" }} />
              )}
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />

          {/* Logout Link */}
          <MenuItem
            onClick={handleLogout}
            sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: "#ffffff" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      )}
    </AppBar>
  );
};

export default CompanyNavbar;