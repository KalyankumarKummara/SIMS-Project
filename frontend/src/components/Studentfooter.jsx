import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
} from "@mui/icons-material";
import simsLogo from "../assets/sims-logo.jpg"; // Import the logo

const StudentFooter = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #2563eb, #1d4ed8)", 
        color: "#ffffff",
        padding: "40px 20px",
        marginTop: "auto", 
      }}
    >
      <Grid container spacing={4} justifyContent="space-between">
        {/* Internship Portal Section */}
        <Grid item xs={12} md={4}>
          {/* SIMS Logo and Text */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* SIMS Logo */}
            <Box
              component="img"
              src={simsLogo}
              alt="SIMS Logo"
              sx={{
                height: 80, // Increased size
                width: 80, // Ensure width and height are equal for a perfect circle
                borderRadius: "50%", // Makes the logo circular
                border: "2px solid white", // Adds a white border
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Adds a subtle shadow
                objectFit: "cover", // Ensures the image fits within the container
              }}
            />
            {/* Internship Portal Text */}
            <Typography
              variant="h3" // Increased size
              fontWeight="bold"
              sx={{ fontSize: "1.5rem", color: "#ffffff" }} // Custom styling
            >
              Student Internship Management System 
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.8, marginTop: 2 }}>
            Empowering students to find the best internships and kickstart their careers.
          </Typography>
        </Grid>

        {/* Quick Links Section */}
        <Grid item xs={12} md={2}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Links
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link to="/internship/internship-list" style={{ color: "#ffffff", textDecoration: "none" }}>
              Internships
            </Link>
            <Link to="/login" style={{ color: "#ffffff", textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/privacy-policy" style={{ color: "#ffffff", textDecoration: "none" }}>
              Privacy Policy
            </Link>
          </Box>
        </Grid>

        {/* Contact Us Section */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Email: kalyankumarcse3@gmail.com
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Phone: +91 9390940216
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Address: JNTUA College of Engineering Anantapur
          </Typography>
        </Grid>

        {/* Connect With Us Section */}
        <Grid item xs={12} md={2}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Connect with us
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton
              component="a"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#ffffff" }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#ffffff" }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#ffffff" }}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#ffffff" }}
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ backgroundColor: "#ffffff", margin: "20px 0" }} />

      {/* Footer Bottom Section */}
      <Box sx={{ textAlign: "center", opacity: 0.8 }}>
        <Typography variant="body2">
          © SIMS All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentFooter;