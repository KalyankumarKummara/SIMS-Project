import React from "react";
import { 
  AppBar,
  Toolbar,
  Container,
  Typography,
  Button,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Box,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import simsLogo from "../assets/sims-logo.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <AppBar 
      position="fixed"
      sx={{
        background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Logo with animated hover effect */}
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1,
              "&:hover": {
                transform: "scale(1.05)",
                cursor: "pointer"
              },
              transition: "transform 0.3s ease",
            }}
            onClick={() => navigate("/")}
          >
            <Avatar 
              src={simsLogo}
              alt="SIMS Logo"
              sx={{
                width: 50,
                height: 50,
                border: "2px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
            />
            <Typography 
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "white",
                display: { xs: "none", md: "block" },
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              Student Internship Management System
            </Typography>
          </Box>

          {/* Desktop Navigation - Simple Text Links */}
          {!isMobile ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Button
                onClick={() => navigate("/login")}
                sx={{
                  color: "white",
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: "1rem",
                  px: 0,
                  minWidth: 0,
                  "&:hover": {
                    color: "rgba(255, 255, 255, 0.9)",
                    backgroundColor: "transparent",
                    transform: "none",
                  },
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                sx={{
                  color: "white",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  px: 0,
                  minWidth: 0,
                  "&:hover": {
                    color: "rgba(255, 255, 255, 0.9)",
                    backgroundColor: "transparent",
                    transform: "none",
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          ) : (
            /* Mobile Menu Button with animation */
            <IconButton 
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ 
                color: "white",
                "&:hover": {
                  transform: "rotate(90deg)",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          )}

          {/* Mobile Drawer with Simple Text Links */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                color: "white",
                width: "75%",
                maxWidth: 300,
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  mb: 2,
                  "&:hover": {
                    cursor: "pointer",
                  }
                }}
                onClick={() => {
                  navigate("/");
                  setDrawerOpen(false);
                }}
              >
                <Avatar 
                  src={simsLogo}
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    mr: 2,
                    border: "2px solid rgba(255, 255, 255, 0.8)",
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  SIMS
                </Typography>
              </Box>
              <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)", mb: 2 }} />
              
              <List>
                <ListItem 
                  button
                  onClick={() => {
                    navigate("/login");
                    setDrawerOpen(false);
                  }}
                  sx={{
                    px: 0,
                    "&:hover": {
                      backgroundColor: "transparent",
                      "& .MuiTypography-root": {
                        color: "rgba(255, 255, 255, 0.9)",
                      }
                    },
                  }}
                >
                  <ListItemText 
                    primary="Login" 
                    primaryTypographyProps={{ 
                      fontWeight: 500,
                      fontSize: "1.1rem",
                    }}
                  />
                </ListItem>
                <ListItem 
                  button
                  onClick={() => {
                    navigate("/signup");
                    setDrawerOpen(false);
                  }}
                  sx={{
                    px: 0,
                    "&:hover": {
                      backgroundColor: "transparent",
                      "& .MuiTypography-root": {
                        color: "rgba(255, 255, 255, 0.9)",
                      }
                    },
                  }}
                >
                  <ListItemText 
                    primary="Sign Up" 
                    primaryTypographyProps={{ 
                      fontWeight: 600,
                      fontSize: "1.1rem",
                    }}
                  />
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;