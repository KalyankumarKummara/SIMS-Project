import React from "react";
import { 
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme
} from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  Email
} from "@mui/icons-material";
import simsLogo from "../assets/sims-logo.jpg";

const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
        color: "white",
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Company Info with Logo */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
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
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Student Internship Management System
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Empowering Students and Recruiters to Connect Seamlessly
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/" color="inherit" underline="hover">
                Home
              </Link>
              <Link href="/about" color="inherit" underline="hover">
                About
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contact
              </Link>
              <Link href="/faq" color="inherit" underline="hover">
                FAQ
              </Link>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Resources
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/blog" color="inherit" underline="hover">
                Blog
              </Link>
              <Link href="/help-center" color="inherit" underline="hover">
                Help Center
              </Link>
              <Link href="/privacy" color="inherit" underline="hover">
                Privacy Policy
              </Link>
              <Link href="/terms" color="inherit" underline="hover">
                Terms of Service
              </Link>
            </Box>
          </Grid>

          {/* Contact and Social Section */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {/* Contact Info */}
              <Grid item xs={12} sm={6} md={12} lg={6}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Contact Us
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Email fontSize="small" /> kalyankumarcse3@gmail.com
                  </Box>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  JNTUA College of Engineering Anantapur
                </Typography>
                <Typography variant="body2">
                  Phone: +91 9390940216
                </Typography>
              </Grid>

              {/* Social Links */}
              <Grid item xs={12} sm={6} md={12} lg={6}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Connect With Us
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
                  <IconButton 
                    component="a" 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    sx={{ color: "white" }}
                  >
                    <Facebook />
                  </IconButton>
                  <IconButton 
                    component="a" 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    sx={{ color: "white" }}
                  >
                    <Twitter />
                  </IconButton>
                  <IconButton 
                    component="a" 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    sx={{ color: "white" }}
                  >
                    <LinkedIn />
                  </IconButton>
                  <IconButton 
                    component="a" 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    sx={{ color: "white" }}
                  >
                    <Instagram />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: "rgba(255, 255, 255, 0.2)" }} />

        {/* Copyright */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="body2" align="center">
            © SIMS. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ mt: 1, opacity: 0.8 }}>
            Empowering the next generation of professionals
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;