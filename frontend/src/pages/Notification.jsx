import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  Paper,
  Avatar,
  Chip,
  Box,
  MenuItem,
  FormControl,
  Select,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { CheckCircle, Delete, MarkEmailRead, Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router";
import StudentDashboardNavbar from "../components/StudentNavbar";
import Footer from "../components/Studentfooter";
// Replace with your correct backend URL
const API_BASE_URL = "http://localhost:8000";

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm")); // Detect mobile screen

  // Fetch notifications for the selected user
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/${selectedUser}`);
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleViewDetails = (internshipId) => {
    navigate(`/internship/${internshipId}`);
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/notifications/mark-all-read/${selectedUser}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/notifications/delete-all/${selectedUser}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  useEffect(() => {
    const studentId = localStorage.getItem("student_id");
    if (studentId) {
      setSelectedUser(studentId);
    } else {
      console.error("Student ID not found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchNotifications();
    }
  }, [selectedUser]);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    return notification.type === filter;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Navbar */}
      <StudentDashboardNavbar pageTitle="Notifications" />

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 4, bgcolor: "background.paper" }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Notifications sx={{ fontSize: isMobile ? 30 : 40, color: "primary.main", mr: 2 }} />
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold", color: "primary.main" }}>
              Manage Notifications
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {/* Filter and Action Buttons */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" size="small" fullWidth>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                  <MenuItem value="status_update">Status_Update</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: isMobile ? "flex-start" : "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MarkEmailRead />}
                  onClick={markAllAsRead}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  {isMobile ? "Mark All" : "Mark All as Read"}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<Delete />}
                  onClick={deleteAllNotifications}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  {isMobile ? "Delete All" : "Delete All Notifications"}
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
                color: "text.secondary",
              }}
            >
              <Typography variant="h6">You have no notifications</Typography>
            </Box>
          ) : (
            <List>
              {filteredNotifications.map((notification) => (
                <Paper
                  key={notification._id}
                  elevation={2}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: notification.is_read ? "background.paper" : "action.hover",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 4,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <ListItem>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: isMobile ? 30 : 40, height: isMobile ? 30 : 40 }}>
                      <CheckCircle />
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontWeight: "bold" }}>
                          {notification.message}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={notification.type}
                            size="small"
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Created At: {new Date(notification.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      {!notification.is_read && (
                        <IconButton
                          edge="end"
                          aria-label="mark-as-read"
                          onClick={() => markAsRead(notification._id)}
                          sx={{ color: "primary.main" }}
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteNotification(notification._id)}
                        sx={{ color: "error.main" }}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              ))}
            </List>
          )}
        </Paper>
      </Container>

      <Footer></Footer>
    </div>
  );
};

export default NotificationManagement;