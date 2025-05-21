import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { FaMapMarkerAlt, FaClock, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import simsLogo from "../assets/sims-logo.jpg";
import Carousel from "../components/Carousel";
import backgroundImage from "../assets/Carousel-img2.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/internships");
        const data = await response.json();
        
        if (data.status === "success") {
          setInternships(data.data);
        } else {
          throw new Error("Failed to fetch internships");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredInternships = internships
    .filter(internship => internship.internship_status === "Active")
    .slice(0, 6);

  const handleImgError = (e) => {
    e.target.src = '/default-logo.png';
  };

  return (
    <Box>
      <Navbar />
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#ffffff",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Box
          component="img"
          src={simsLogo}
          alt="SIMS Logo"
          sx={{
            height: 120,
            width: 120,
            borderRadius: "50%",
            border: "4px solid white",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
            zIndex: 1,
          }}
        />

        <Typography
          variant="h2"
          component="h1"
          sx={{
            mt: 4,
            fontWeight: "bold",
            fontSize: isMobile ? "2.5rem" : "4rem",
            zIndex: 1,
            animation: "fadeIn 2s ease-in-out",
          }}
        >
          Welcome to SIMS
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mt: 2,
            mb: 4,
            zIndex: 1,
            animation: "fadeIn 3s ease-in-out",
          }}
        >
          Empowering Students and Recruiters to Connect Seamlessly
        </Typography>

        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/signup")}
          sx={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontWeight: "bold",
            padding: "12px 24px",
            borderRadius: "8px",
            zIndex: 1,
            "&:hover": {
              backgroundColor: "#1d4ed8",
              transform: "scale(1.05)",
            },
            transition: "transform 0.3s ease",
          }}
        >
          Get Started
        </Button>
      </Box>

      <Container sx={{ py: 8 }}>
        <Carousel />
      </Container>

      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
          Why Choose SIMS?
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                },
              }}
            >
              <SchoolIcon sx={{ fontSize: 60, color: "#2563eb", mb: 2 }} />
              <Typography variant="h5" component="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                For Students
              </Typography>
              <Typography variant="body1">
                Find the best internships tailored to your skills and career goals.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                },
              }}
            >
              <WorkIcon sx={{ fontSize: 60, color: "#2563eb", mb: 2 }} />
              <Typography variant="h5" component="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                For Recruiters
              </Typography>
              <Typography variant="body1">
                Post internships and find the best talent for your organization.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                },
              }}
            >
              <PeopleIcon sx={{ fontSize: 60, color: "#2563eb", mb: 2 }} />
              <Typography variant="h5" component="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                For Everyone
              </Typography>
              <Typography variant="body1">
                A platform designed to connect students and recruiters seamlessly.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Internships Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
          Featured Internships
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : filteredInternships.length > 0 ? (
          <Grid container spacing={4}>
            {filteredInternships.map((internship) => (
              <Grid item xs={12} sm={6} md={4} key={internship.internship_id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box sx={{ 
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 200,
                    backgroundColor: "#f8fafc",
                    p: 2
                  }}>
                    {internship.company_logo ? (
                      <img
                        src={internship.company_logo}
                        alt={`${internship.company_name} logo`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          borderRadius: "50%",
                          border: "2px solid #3b82f6"
                        }}
                        onError={handleImgError}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 120,
                          height: 120,
                          fontSize: "2.5rem",
                          bgcolor: "#3b82f6",
                          color: "white",
                          border: "2px solid #3b82f6"
                        }}
                      >
                        {internship.company_name[0]?.toUpperCase() || "C"}
                      </Avatar>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                      {internship.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {internship.company_name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <FaMapMarkerAlt className="mr-2 text-blue-500" />
                      <Typography variant="body2">{internship.location}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <FaClock className="mr-2 text-purple-500" />
                      <Typography variant="body2">{internship.duration}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <FaCheckCircle className="mr-2 text-green-500" />
                      <Typography variant="body2" color="green">
                        {internship.internship_status}
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/internship/details/${internship.internship_id}`)}
                      sx={{
                        backgroundColor: "#3b82f6",
                        "&:hover": { backgroundColor: "#2563eb" }
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center" color="text.secondary">
            No active internships available at the moment
          </Typography>
        )}

        <Box textAlign="center" mt={4}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/internship/internship-list")}
            sx={{
              borderColor: "#3b82f6",
              color: "#3b82f6",
              "&:hover": {
                borderColor: "#2563eb",
                backgroundColor: "rgba(59, 130, 246, 0.04)"
              }
            }}
          >
            View All Internships
          </Button>
        </Box>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ backgroundColor: "#f5f5f5", py: 8 }}>
        <Container>
          <Typography variant="h4" component="h2" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
            What Our Users Say
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "24px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Avatar
                  alt="Kalyankumar"
                  src="https://res.cloudinary.com/dtt1yw2hk/image/upload/v1743099513/profile_images/67c5b976b987e2710d35885a_profile.jpg"
                  sx={{ 
                    width: 200, 
                    height: 200, 
                    mb: 2,
                    border: "2px solid #3b82f6",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)"
                  }}
                />
                <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                  Kalyankumar
                </Typography>
                <Typography variant="body1">
                  "SIMS helped me find the perfect internship that aligned with my career goals. Highly recommended!"
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "24px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Avatar
                  alt="Recruiter"
                  src="https://res.cloudinary.com/dtt1yw2hk/image/upload/v1743098428/company_logos/67b1c0ed0258b028874597e9_logo.png"
                  sx={{ 
                    width: 200, 
                    height: 200, 
                    mb: 2,
                    border: "2px solid #3b82f6",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)"
                  }}
                />
                <Typography variant="h6" component="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                  Umapathi K
                </Typography>
                <Typography variant="body1">
                  "As a recruiter, SIMS made it easy to find talented students for our internships. Great platform!"
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default LandingPage;