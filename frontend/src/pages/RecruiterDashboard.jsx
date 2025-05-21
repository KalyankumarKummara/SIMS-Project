import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Doughnut, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { FaBell } from "react-icons/fa";
import CompanyNavbar from "../components/CompanyNavbar"
import Footer from "../components/Companyfooter"
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    posted_internships: [],
    application_status_counts: { pending: 0, accepted: 0, rejected: 0, shortlisted: 0 },
    notifications: [],
    profile_complete: false,
  });

  const [internshipsWithApplicationCount, setInternshipsWithApplicationCount] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "recruiter") {
      navigate("/login");
    }

    // Fetch dashboard data from the backend
    fetchDashboardData();

    // Fetch internships with application count
    const fetchData = async () => {
      const data = await fetchInternshipsWithApplicationCount();
      setInternshipsWithApplicationCount(data);
    };

    fetchData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("http://localhost:8000/company/dashboard", {
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

  const fetchInternshipsWithApplicationCount = async () => {
    try {
      const companyId = localStorage.getItem("company_id");
      const token = localStorage.getItem("token");

      if (!companyId || !token) {
        throw new Error("Company ID or token not found");
      }

      const response = await fetch(`http://localhost:8000/internships/company/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch internships with application count");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching internships with application count:", error);
      return [];
    }
  };

  // Calculate total applications
  const totalApplications =
    (dashboardData.application_status_counts?.pending || 0) +
    (dashboardData.application_status_counts?.accepted || 0) +
    (dashboardData.application_status_counts?.rejected || 0) +
    (dashboardData.application_status_counts?.shortlisted || 0);

  // Data for Quick Statistics Cards
  const quickStats = [
    {
      title: "Posted Internships",
      value: dashboardData.posted_internships.length || 0,
      increase: dashboardData.posted_internships.length > 0 ? "+10%" : null,
      icon: "📄",
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Total Applications",
      value: totalApplications || 0,
      increase: totalApplications > 0 ? "+25%" : null,
      icon: "📊",
      bgColor: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    },
    {
      title: "Pending Applications",
      value: dashboardData.application_status_counts?.pending || 0,
      increase: dashboardData.application_status_counts?.pending > 0 ? "+5%" : null,
      icon: "⏳",
      bgColor: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    },
    {
      title: "Accepted Applications",
      value: dashboardData.application_status_counts?.accepted || 0,
      increase: dashboardData.application_status_counts?.accepted > 0 ? "+15%" : null,
      icon: "✅",
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
    },
  ];

  // Data for Application Status Distribution (Doughnut Chart)
  const applicationStatusData = {
    labels: ["Pending", "Accepted", "Rejected", "Shortlisted"],
    datasets: [
      {
        data: [
          dashboardData.application_status_counts?.pending || 0,
          dashboardData.application_status_counts?.accepted || 0,
          dashboardData.application_status_counts?.rejected || 0,
          dashboardData.application_status_counts?.shortlisted || 0,
        ],
        backgroundColor: ["#f59e0b", "#10b981", "#ef4444", "#3b82f6"],
        hoverBackgroundColor: ["#d97706", "#059669", "#dc2626", "#2563eb"],
      },
    ],
  };

  // Data for Internships by Duration (Bar Chart)
  const internshipsByDuration = {
    labels: ["1 Month", "2 Months", "3 Months", "4 Months", "5 Months", "6 Months", "9 Months", "10 Months", "12 Months"],
    datasets: [
      {
        label: "Number of Internships",
        data: [
          dashboardData.posted_internships.filter((internship) => internship.duration === "1 Months").length,
          dashboardData.posted_internships.filter((internship) => internship.duration === "2 Months").length,
          dashboardData.posted_internships.filter((internship) => internship.duration === "3 Months").length,
          dashboardData.posted_internships.filter((internship) => internship.duration === "4 Months").length,
          dashboardData.posted_internships.filter((internship) => internship.duration === "5 Months").length,
          dashboardData.posted_internships.filter((internship) => internship.duration === "6 Months").length,
          dashboardData.posted_internships.filter((internship) => internship.duration === "9 Months").length,
          dashboardData.posted_internships.filter((internship) => internship.duration === "10 Months").length,
          dashboardData.posted_internships.filter((internship) => internship.duration === "12 Months").length,
        ],
        backgroundColor: ["#4F46E5", "#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#6366F1", "#8B5CF6", "#EC4899", "#22D3EE"],
        borderColor: ["#4F46E5", "#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#6366F1", "#8B5CF6", "#EC4899", "#22D3EE"],
        borderWidth: 1,
      },
    ],
  };

  // Data for Internships by Mode (Pie Chart)
  const internshipsByMode = {
    labels: ["On-site", "Remote", "Hybrid"],
    datasets: [
      {
        label: "Internships by Mode",
        data: [
          dashboardData.posted_internships.filter((internship) => internship.mode_of_internship === "On-site").length,
          dashboardData.posted_internships.filter((internship) => internship.mode_of_internship === "Remote").length,
          dashboardData.posted_internships.filter((internship) => internship.mode_of_internship === "Hybrid").length,
        ],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
        borderColor: ["#3B82F6", "#10B981", "#F59E0B"],
        borderWidth: 1,
      },
    ],
  };

  // Data for Accepted vs Rejected Ratio (Bar Chart)
  const acceptedRejectedRatio = {
    labels: ["Accepted", "Rejected"],
    datasets: [
      {
        label: "Accepted vs Rejected",
        data: [
          dashboardData.application_status_counts?.accepted || 0,
          dashboardData.application_status_counts?.rejected || 0,
        ],
        backgroundColor: ["#10B981", "#EF4444"],
        borderColor: ["#10B981", "#EF4444"],
        borderWidth: 1,
        barThickness: 70,
        categoryPercentage: 0.7,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <CompanyNavbar pageTitle="Company Dashboard" />
      {/* Main Content */}
      <div className="p-6">
        {/* Profile Complete Section */}
        {!dashboardData.profile_complete && (
          <div className="mb-8 mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg text-white transition-all hover:shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-5">
                  {/* Icon */}
                  <div className="p-2 md:p-3 bg-white bg-opacity-20 rounded-full flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  {/* Text */}
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold">Complete Your Profile</h2>
                    <p className="text-xs md:text-sm mt-1 opacity-90 max-w-[500px]">
                      Stand out to candidates by completing your company profile. Add details about your company, culture, and values to attract the best talent!
                    </p>
                  </div>
                </div>
                {/* Button */}
                <Button
                  variant="contained"
                  color="primary"
                  className="bg-white text-purple-600 font-medium md:font-semibold py-1.5 px-4 md:py-2 md:px-5 rounded-lg shadow-sm transition-all hover:shadow-md whitespace-nowrap mt-2 md:mt-0"
                  onClick={() => navigate("/recruiter/profile/company")}
                >
                  Complete Profile
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} p-6 rounded-lg shadow-lg text-white transform transition-transform hover:scale-105`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{stat.title}</h2>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
              {stat.increase && <p className="text-sm mt-2">{stat.increase} Increased</p>}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Application Status Distribution (Doughnut Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Status Distribution</h2>
            {totalApplications === 0 ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "256px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
                <Typography variant="body1" sx={{ color: "#757575", fontStyle: "italic" }}>
                  No students have applied for the posted internships yet.
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
                      tooltip: { enabled: true, mode: "index", intersect: false },
                    },
                    animation: { duration: 1000, easing: "easeInOutQuad" },
                  }}
                />
              </div>
            )}
          </div>

          {/* Internships by Duration (Bar Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Internships by Duration</h2>
            {dashboardData.posted_internships.length === 0 ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "256px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
                <Typography variant="body1" sx={{ color: "#757575", fontStyle: "italic" }}>
                  No internships have been posted yet.
                </Typography>
              </Box>
            ) : (
              <div className="w-full h-64">
                <Bar
                  data={internshipsByDuration}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: false },
                      tooltip: { enabled: true, mode: "index", intersect: false },
                    },
                    animation: { duration: 1000, easing: "easeInOutQuad" },
                  }}
                />
              </div>
            )}
          </div>

          {/* Accepted vs Rejected Ratio (Bar Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Accepted vs Rejected Ratio</h2>
            {dashboardData.application_status_counts.accepted === 0 && dashboardData.application_status_counts.rejected === 0 ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "256px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
                <Typography variant="body1" sx={{ color: "#757575", fontStyle: "italic" }}>
                  No applications have been accepted or rejected yet.
                </Typography>
              </Box>
            ) : (
              <div className="w-full h-64">
                <Bar
                  data={acceptedRejectedRatio}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: false },
                      tooltip: { enabled: true, mode: "index", intersect: false },
                    },
                    animation: { duration: 1000, easing: "easeInOutQuad" },
                  }}
                />
              </div>
            )}
          </div>

          {/* Compact Internship Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Internship Application Details</h2>
            {internshipsWithApplicationCount.length === 0 ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "256px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
                <Typography variant="body1" sx={{ color: "#757575", fontStyle: "italic" }}>
                  No internships have been posted yet.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: "256px", overflow: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                        Title
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                        Duration
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                        Applications
                      </TableCell>
                      <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                        Details
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {internshipsWithApplicationCount.map((internship) => (
                      <TableRow key={internship._id} hover sx={{ '&:hover': { backgroundColor: "#e0f7fa" } }}>
                        <TableCell>{internship.title}</TableCell>
                        <TableCell>{internship.duration}</TableCell>
                        <TableCell>{internship.application_count || 0}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={!internship.application_count}
                            onClick={() => navigate(`/internships/${internship._id}/applications`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>

        {/* Full Posted Internships Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
          <Typography variant="h5" component="h2" fontWeight="bold" color="primary" gutterBottom>
            Posted Internships
          </Typography>
          {dashboardData.posted_internships.length === 0 ? (
            <Typography variant="body1" className="text-gray-500">
              No internships have been posted yet.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ maxHeight: "70vh", overflow: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                      Title
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                      Domain
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                      Type Of Internship
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                      Location
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                      Duration
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                      Mode
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                      Application Deadline
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#3b82f6", fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.posted_internships.map((internship, index) => (
                    <TableRow key={internship._id || index} hover sx={{ '&:hover': { backgroundColor: "#e0f7fa" } }}>
                      <TableCell>{internship.title}</TableCell>
                      <TableCell>{internship.internship_domain}</TableCell>
                      <TableCell>{internship.type_of_internship}</TableCell>
                      <TableCell>{internship.location}</TableCell>
                      <TableCell>{internship.duration}</TableCell>
                      <TableCell>{internship.mode_of_internship}</TableCell>
                      <TableCell>{internship.application_deadline}</TableCell>
                      <TableCell>{internship.internship_status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;