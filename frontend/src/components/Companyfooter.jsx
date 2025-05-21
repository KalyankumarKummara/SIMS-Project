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
import simsLogo from "../assets/sims-logo.jpg"; 

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const companyId = localStorage.getItem("company_id");

  return (
    <Box
      sx={{
        background: "linear-gradient(45deg, #6a11cb, #2575fc)",
        color: "#ffffff",
        padding: "40px 20px",
        marginTop: "auto",
      }}
    >
      <Grid container spacing={4} justifyContent="space-between">
       
        <Grid item xs={12} md={4}>
         
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
           
            <Box
              component="img"
              src={simsLogo}
              alt="SIMS Logo"
              sx={{
                height: 80, 
                width: 80, 
                borderRadius: "50%", 
                border: "2px solid white", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", 
                objectFit: "cover", 
              }}
            />
           
            <Typography
              variant="h3" 
              fontWeight="bold"
              sx={{ fontSize: "1.5rem", color: "#ffffff" }} 
            >
              Student Internship Portal
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.8, marginTop: 2 }}>
            Empowering students and recruiters to connect seamlessly. Find the best internships and
            kickstart your career with us.
          </Typography>
        </Grid>

        {/* Quick Links Section */}
        <Grid item xs={12} md={2}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Links
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link to="/internship/post" style={{ color: "#ffffff", textDecoration: "none" }}>
              Post Internship
            </Link>
            <Link to="/admin/manage-internship" style={{ color: "#ffffff", textDecoration: "none" }}>
              Manage Internship
            </Link>
            <Link to={`/company-profile/${companyId}`} style={{ color: "#ffffff", textDecoration: "none" }}>
              Profile
            </Link>
            <Link to="/login" style={{ color: "#ffffff", textDecoration: "none" }}>
              Login
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

export default Footer;