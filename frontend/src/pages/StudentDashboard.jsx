import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Doughnut, Bar, Scatter, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, Title } from "chart.js";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Chip, IconButton, Button, AppBar, Toolbar, Avatar, Menu, MenuItem, Container, Grid, Link } from '@mui/material';
import { Close, Notifications, AccountCircle, ExitToApp } from '@mui/icons-material'; 
import StudentDashboardNavbar from "../components/StudentNavbar"; 
import Footer from "../components/Studentfooter";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, Title);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    applied_internships: [], // List of applied internships
    application_status_counts: { pending: 0, accepted: 0, rejected: 0, shortlisted: 0 }, // Application status counts
    notifications: [], // Notifications for the student
    profile_complete: false, // Profile completion status
    saved_internships: [], // List of saved internships
  });

  const [anchorEl, setAnchorEl] = useState(null); // For user profile menu
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const studentRole = localStorage.getItem("role");

    if (!token || studentRole !== "student") {
      navigate("/login");
    }

    // Fetch dashboard data from the backend
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:8000/student/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle notification deletion
  const handleDeleteNotification = async (index) => {
    try {
      // Call the backend API to delete the notification
      const response = await fetch(`http://localhost:8000/notifications/${index}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Remove the notification from the local state
      setDashboardData((prevData) => ({
        ...prevData,
        notifications: prevData.notifications.filter((_, i) => i !== index),
      }));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Calculate counts dynamically from applied_internships
  const statusCounts = dashboardData.applied_internships.reduce(
    (acc, internship) => {
      if (internship.status === "pending") acc.pending += 1;
      else if (internship.status === "shortlisted") acc.shortlisted += 1;
      else if (internship.status === "accepted") acc.accepted += 1;
      else if (internship.status === "rejected") acc.rejected += 1;
      return acc;
    },
    { pending: 0, shortlisted: 0, accepted: 0, rejected: 0 }
  );

  // Calculate applied internships count (including pending, shortlisted, accepted, and rejected)
  const appliedInternshipsCount =
    statusCounts.pending + statusCounts.shortlisted + statusCounts.accepted + statusCounts.rejected;

  // Data for Quick Statistics Cards
  const quickStats = [
    {
      title: "Applied Internships",
      value: appliedInternshipsCount,
      increase: appliedInternshipsCount === 0 ? null : "+10%", // Conditionally set increase
      icon: "📄",
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Pending Applications",
      value: statusCounts.pending,
      increase: statusCounts.pending === 0 ? null : "+5%", // Conditionally set increase
      icon: "⏳",
      bgColor: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    },
    {
      title: "Accepted Applications",
      value: statusCounts.accepted,
      increase: statusCounts.accepted === 0 ? null : "+15%", // Conditionally set increase
      icon: "✅",
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      title: "Shortlisted Applications",
      value: statusCounts.shortlisted,
      increase: statusCounts.shortlisted === 0 ? null : "+20%",
      icon: "📌",
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      title: "Rejected Applications",
      value: statusCounts.rejected,
      increase: statusCounts.rejected === 0 ? null : "+10%", 
      icon: "❌",
      bgColor: "bg-gradient-to-r from-red-500 to-red-600",
    },
  ];

  const applicationStatusData = {
    labels: ["Pending", "Accepted", "Rejected", "Shortlisted"],
    datasets: [
      {
        data: [
          statusCounts.pending,
          statusCounts.accepted,
          statusCounts.rejected,
          statusCounts.shortlisted,
        ],
        backgroundColor: ["#f59e0b", "#10b981", "#ef4444", "#3b82f6"], // Orange, Green, Red, Blue
        hoverBackgroundColor: ["#d97706", "#059669", "#dc2626", "#2563eb"],
      },
    ],
  };

  const internshipTitlesStatusData = {
    labels: Array.from(new Set(dashboardData.applied_internships.map(internship => internship.title))),
    datasets: [
      {
        label: 'Pending',
        data: Array.from(new Set(dashboardData.applied_internships.map(internship => internship.title))).map(title =>
          dashboardData.applied_internships.filter(internship => internship.title === title && internship.status === 'pending').length
        ),
        backgroundColor: '#f59e0b',
      },
      {
        label: 'Accepted',
        data: Array.from(new Set(dashboardData.applied_internships.map(internship => internship.title))).map(title =>
          dashboardData.applied_internships.filter(internship => internship.title === title && internship.status === 'accepted').length
        ),
        backgroundColor: '#10b981',
      },
      {
        label: 'Rejected',
        data: Array.from(new Set(dashboardData.applied_internships.map(internship => internship.title))).map(title =>
          dashboardData.applied_internships.filter(internship => internship.title === title && internship.status === 'rejected').length
        ),
        backgroundColor: '#ef4444',
      },
      {
        label: 'Shortlisted',
        data: Array.from(new Set(dashboardData.applied_internships.map(internship => internship.title))).map(title =>
          dashboardData.applied_internships.filter(internship => internship.title === title && internship.status === 'shortlisted').length
        ),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const modeMapping = {
    "Remote": 1,
    "On-site": 2,
    "Hybrid": 3
  };

  const internshipCounts = {};

  dashboardData.applied_internships.forEach((internship) => {
    const durationMatch = internship.duration.match(/\d+/); // Extract numeric value
    const duration = durationMatch ? parseInt(durationMatch[0]) : null;
    const mode = modeMapping[internship.mode_of_internship];

    if (duration !== null && mode !== undefined) {
      const key = `${duration}-${mode}`;

      if (!internshipCounts[key]) {
        internshipCounts[key] = { x: duration, y: mode, count: 1 };
      } else {
        internshipCounts[key].count += 1; // Count duplicates
      }
    }
  });

  const internshipModeDurationData = {
    datasets: [
      {
        label: "Remote",
        data: Object.values(internshipCounts).filter(d => d.y === 1),
        backgroundColor: "#3b82f6",
        pointRadius: (ctx) => ctx.raw?.count ? ctx.raw.count * 3 : 5, // Ensure default size if count is missing
      },
      {
        label: "On-site",
        data: Object.values(internshipCounts).filter(d => d.y === 2),
        backgroundColor: "#ef4444",
        pointRadius: (ctx) => ctx.raw?.count ? ctx.raw.count * 3 : 5,
      },
      {
        label: "Hybrid",
        data: Object.values(internshipCounts).filter(d => d.y === 3),
        backgroundColor: "#f59e0b",
        pointRadius: (ctx) => ctx.raw?.count ? ctx.raw.count * 3 : 5,
      },
    ],
  };

  // Data for location of applied internships 
  const locationsData = {
    labels: ['Hyderabad', 'Bangalore', 'Chennai', 'SRI City', 'Tirupati'],
    datasets: [
      {
        label: 'Internships',
        data: [
          dashboardData.applied_internships.filter(internship => internship.location === 'Hyderabad').length,
          dashboardData.applied_internships.filter(internship => internship.location === 'Bangalore').length,
          dashboardData.applied_internships.filter(internship => internship.location === 'Chennai').length,
          dashboardData.applied_internships.filter(internship => internship.location === 'SRI City').length,
          dashboardData.applied_internships.filter(internship => internship.location == 'Tirupati').length,
        ],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      },
    ],
  };

  // Data for Internship Duration Distribution (Box Plot)
  const durations = dashboardData.applied_internships
    .map(internship => {
      const match = internship.duration.match(/\d+/); // Extract number
      return match ? parseInt(match[0]) : null;
    })
    .filter(duration => duration !== null); // Remove any null values

  const durationCounts = durations.reduce((acc, duration) => {
    acc[duration] = (acc[duration] || 0) + 1;
    return acc;
  }, {});

  const internshipDurationData = {
    labels: Object.keys(durationCounts).map(d => `${d} Months`), // X-axis labels (e.g., "4 Months", "6 Months")
    datasets: [
      {
        label: 'Number of Internships',
        data: Object.values(durationCounts), // Y-axis values (frequency of each duration)
        backgroundColor: '#3b82f6',
        borderColor: '#1e40af',
        borderWidth: 1,
      },
    ],
  };

  const savedInternshipsCount =
    dashboardData.saved_internships?.length > 0 &&
    !dashboardData.saved_internships[0].message
      ? dashboardData.saved_internships.length
      : 0;

  // Data for Pie Chart (Saved vs. Applied Internships)
  const savedVsAppliedData = {
    labels: ["Saved Internships", "Applied Internships"],
    datasets: [
      {
        data: [savedInternshipsCount, appliedInternshipsCount],
        backgroundColor: ["#3b82f6", "#10b981"], // Blue for saved, Green for applied
        hoverBackgroundColor: ["#2563eb", "#059669"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <StudentDashboardNavbar pageTitle="Student Dashboard" /> 

      {/* Main Content */}
      <div className="p-6">
        {/* Profile Completion Button */}
        {!dashboardData.profile_complete && (
          <Box
            sx={{
              backgroundColor: "#e3f2fd", // Light blue background
              borderRadius: "12px", // Rounded corners
              padding: "24px", // Padding inside the box
              textAlign: "center", // Center-align text
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
              marginBottom: "24px", // Margin below the box
              border: "1px solid #90caf9", // Light blue border
              transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth hover effect
              "&:hover": {
                transform: "translateY(-4px)", // Lift the box on hover
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)", // Enhanced shadow on hover
              },
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                backgroundColor: "#1e88e5", // Blue background for the icon
                width: "64px", // Icon container size
                height: "64px", // Icon container size
                borderRadius: "50%", // Circular shape
                display: "flex", // Center the icon
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px", // Center the icon and add margin below
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "#ffffff", // White icon color
                  fontWeight: "bold", // Bold icon
                }}
              >
                📝 {/* Icon */}
              </Typography>
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#0d47a1", // Dark blue text
                marginBottom: "12px", // Margin below the title
              }}
            >
              Complete Your Profile
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: "#37474f", // Dark gray text
                marginBottom: "24px", // Margin below the description
              }}
            >
              Unlock the full potential of your internship journey! Complete your profile to get personalized recommendations and stand out to recruiters.
            </Typography>

            {/* Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1e88e5", // Blue button background
                color: "#ffffff", // White button text
                fontWeight: "bold",
                padding: "12px 24px", // Button padding
                borderRadius: "8px", // Rounded button corners
                textTransform: "none", // Prevent uppercase text
                "&:hover": {
                  backgroundColor: "#1565c0", // Darker blue on hover
                },
              }}
              onClick={() => navigate("/student/profile")}
            >
              Complete Now
            </Button>
          </Box>
        )}

        {/* Quick Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} p-6 rounded-lg shadow-lg text-white transform transition-transform hover:scale-105`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{stat.title}</h2>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
              {stat.increase && ( // Only show if increase is not null
                <p className="text-sm mt-2">{stat.increase} Increased</p>
              )}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Application Status Distribution (Doughnut Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Status Distribution</h2>
            {dashboardData.applied_internships.length === 0 ? ( // Check if no internships have been applied
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "256px", // Match the height of the Doughnut chart
                  backgroundColor: "#f5f5f5", // Light gray background
                  borderRadius: "8px", // Rounded corners
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#757575", // Gray text
                    fontStyle: "italic", // Italic text
                  }}
                >
                  No internships have been applied yet.
                </Typography>
              </Box>
            ) : (
              <div className="w-full h-64">
                <Doughnut
                  data={applicationStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: false },
                      tooltip: {
                        enabled: true,
                        mode: "index",
                        intersect: false,
                      },
                    },
                    animation: {
                      duration: 1000,
                      easing: "easeInOutQuad",
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Internship Titles and Status Distribution (Stacked Bar Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Internship Titles and Status Distribution</h2>
            {dashboardData.applied_internships.length === 0 ? ( // Check if no internships have been applied
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "256px", // Match the height of the chart
                  backgroundColor: "#f5f5f5", // Light gray background
                  borderRadius: "8px", // Rounded corners
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#757575", // Gray text
                    fontStyle: "italic", // Italic text
                  }}
                >
                  No internships have been applied yet.
                </Typography>
              </Box>
            ) : (
              <div className="w-full h-64">
                <Bar
                  data={internshipTitlesStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: false },
                      tooltip: {
                        enabled: true,
                        mode: "index",
                        intersect: false,
                      },
                    },
                    animation: {
                      duration: 1000,
                      easing: "easeInOutQuad",
                    },
                    scales: {
                      x: {
                        stacked: true,
                      },
                      y: {
                        stacked: true,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Internship Mode vs Duration Analysis (Scatter Plot) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Internship Mode vs Duration Analysis</h2>
            {dashboardData.applied_internships.length === 0 ? ( // Check if no internships have been applied
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "256px", // Match the height of the chart
                  backgroundColor: "#f5f5f5", // Light gray background
                  borderRadius: "8px", // Rounded corners
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#757575", // Gray text
                    fontStyle: "italic", // Italic text
                  }}
                >
                  No internships have been applied yet.
                </Typography>
              </Box>
            ) : (
              <div className="w-full h-64">
                <Scatter
                  data={internshipModeDurationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: false },
                      tooltip: {
                        enabled: true,
                        mode: "index",
                        intersect: false,
                      },
                    },
                    animation: {
                      duration: 1000,
                      easing: "easeInOutQuad",
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Duration (Months)',
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Mode',
                        },
                        ticks: {
                          callback: (value) => {
                            if (value === 1) return 'Remote';
                            if (value === 2) return 'On-site';
                            if (value === 3) return 'Hybrid';
                            return '';
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Locations of Applied Internships (Geographic Heatmap) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Locations of Applied Internships</h2>
            {dashboardData.applied_internships.length === 0 ? ( // Check if no internships have been applied
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "256px", // Match the height of the chart
                  backgroundColor: "#f5f5f5", // Light gray background
                  borderRadius: "8px", // Rounded corners
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#757575", // Gray text
                    fontStyle: "italic", // Italic text
                  }}
                >
                  No internships have been applied yet.
                </Typography>
              </Box>
            ) : (
              <div className="w-full h-64">
                <Bar
                  data={locationsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: false },
                      tooltip: {
                        enabled: true,
                        mode: "index",
                        intersect: false,
                      },
                    },
                    animation: {
                      duration: 1000,
                      easing: "easeInOutQuad",
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Internship Duration Distribution (Box Plot) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Internship Duration Distribution</h2>
            {dashboardData.applied_internships.length === 0 ? ( // Check if no internships have been applied
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "256px", // Match the height of the chart
                  backgroundColor: "#f5f5f5", // Light gray background
                  borderRadius: "8px", // Rounded corners
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#757575", // Gray text
                    fontStyle: "italic", // Italic text
                  }}
                >
                  No internships have been applied yet.
                </Typography>
              </Box>
            ) : (
              <div className="w-full h-64">
                <Bar
                  data={internshipDurationData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: false },
                      tooltip: {
                        enabled: true,
                        mode: "index",
                        intersect: false,
                      },
                    },
                    animation: {
                      duration: 1000,
                      easing: "easeInOutQuad",
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Pie Chart (Saved vs. Applied Internships) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Saved vs. Applied Internships</h2>
            {dashboardData.saved_internships.length === 0 && dashboardData.applied_internships.length === 0 ? ( // Check if no internships are saved or applied
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "256px", // Match the height of the chart
                  backgroundColor: "#f5f5f5", // Light gray background
                  borderRadius: "8px", // Rounded corners
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#757575", // Gray text
                    fontStyle: "italic", // Italic text
                  }}
                >
                  No internships have been saved or applied yet.
                </Typography>
              </Box>
            ) : (
              <div className="w-full h-64">
                <Pie
                  data={savedVsAppliedData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: false },
                      tooltip: {
                        enabled: true,
                        mode: "index",
                        intersect: false,
                      },
                    },
                    animation: {
                      duration: 1000,
                      easing: "easeInOutQuad",
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Notifications and Saved Internships Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Notifications Section (1/3 of the row) */}
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
            <div className="max-h-48 overflow-y-auto">
              {dashboardData.notifications.length === 0 ? (
                <Typography variant="body1" className="text-gray-500">
                  You have no notifications.
                </Typography>
              ) : (
                dashboardData.notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="p-4 mb-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
                  >
                    <Typography variant="body1">{notification.message}</Typography>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Saved Internships Table (2/3 of the row) */}
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
            <Typography variant="h5" component="h2" fontWeight="bold" color="primary" gutterBottom>
              Saved Internships
            </Typography>
            {dashboardData.saved_internships.length === 0 ? (
              <Typography variant="body1" className="text-gray-500">
                No internships have been saved yet.
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: "70vh", overflow: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6", borderRight: "none !important" }}>
                        Company Name
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6", borderRight: "none !important" }}>
                        Title
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6", borderRight: "none !important" }}>
                        Location
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6", borderRight: "none !important" }}>
                        Duration
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6", borderRight: "none !important" }}>
                        Mode of Internship
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.saved_internships.map((internship, index) => (
                      <TableRow
                        key={`${internship.internship_id}-${index}`}
                        hover
                        sx={{ '&:hover': { backgroundColor: "#e0f7fa" } }}
                      >
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0", borderRight: "none !important" }}>{internship.company_name}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0", borderRight: "none !important" }}>{internship.title}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0", borderRight: "none !important" }}>{internship.location}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0", borderRight: "none !important" }}>{internship.duration}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #e0e0e0", borderRight: "none !important" }}>{internship.mode_of_internship}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>

        {/* Applied Internships Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
          <Typography variant="h5" component="h2" fontWeight="bold" color="primary" gutterBottom>
            Applied Internships
          </Typography>
          {dashboardData.applied_internships.length === 0 ? (
            <Typography variant="body1" className="text-gray-500">
              No internships have been applied yet.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ maxHeight: "70vh", overflow: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: "#f59e0b", // Orange color
                        fontWeight: "bold",
                        color: "white",
                        borderBottom: "2px solid #f59e0b",
                        borderRight: "none !important",
                      }}
                    >
                      Company Name
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f59e0b", // Orange color
                        fontWeight: "bold",
                        color: "white",
                        borderBottom: "2px solid #f59e0b",
                        borderRight: "none !important",
                      }}
                    >
                      Title
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f59e0b", // Orange color
                        fontWeight: "bold",
                        color: "white",
                        borderBottom: "2px solid #f59e0b",
                        borderRight: "none !important",
                      }}
                    >
                      Location
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f59e0b", // Orange color
                        fontWeight: "bold",
                        color: "white",
                        borderBottom: "2px solid #f59e0b",
                        borderRight: "none !important",
                      }}
                    >
                      Duration
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f59e0b", // Orange color
                        fontWeight: "bold",
                        color: "white",
                        borderBottom: "2px solid #f59e0b",
                        borderRight: "none !important",
                      }}
                    >
                      Mode of Internship
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: "#f59e0b", // Orange color
                        fontWeight: "bold",
                        color: "white",
                        borderBottom: "2px solid #f59e0b",
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.applied_internships.map((internship, index) => (
                    <TableRow
                      key={`${internship.internship_id}-${index}`}
                      hover
                      sx={{ '&:hover': { backgroundColor: "#e0f7fa" } }}
                    >
                      <TableCell sx={{ borderBottom: "1px solid #e0e0e0", borderRight: "none !important" }}>{internship.company_name}</TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #e0e0e0", borderRight: "none !important" }}>{internship.title}</TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #e0e0e0", borderRight: "none !important" }}>{internship.location}</TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #e0e0e0", borderRight: "none !important" }}>{internship.duration}</TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #e0e0e0", borderRight: "none !important" }}>{internship.mode_of_internship}</TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{internship.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>

      </div>
      {/* Footer */}
      <Footer> </Footer>
    </div>
  );
};

export default StudentDashboard;