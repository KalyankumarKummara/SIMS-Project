import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import API_BASE_URL from "../config";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    users_count: { recruiter: 0, student: 0, admin: 0 }, // Initialize with default values
    internships: { total: 0, active: 0, expired: 0 },
    applications_count: 0,
    recruiter_verifications: { pending: 0, approved: 0, rejected: 0 },
    user_verifications: { verified: 0, unverified: 0 },
    user_details: [], // Add user details state
    internships_list: [], // Initialize internships_list as an empty array
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminRole = localStorage.getItem("role");

    if (!token || adminRole !== "admin") {
      navigate("/login");
    }

    // Fetch dashboard data from the backend
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
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

  // Data for Quick Statistics Cards
  const quickStats = [
    {
      title: "Total Users",
      value: (dashboardData.users_count?.recruiter || 0) + (dashboardData.users_count?.student || 0) + (dashboardData.users_count?.admin || 0), // Use optional chaining
      increase: "+20%",
      icon: "👤",
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Total Applications",
      value: dashboardData.applications_count || 0, // Use optional chaining
      increase: "+15%",
      icon: "📄",
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      title: "Active Internships",
      value: dashboardData.internships?.active || 0, // Use optional chaining
      increase: "+10%",
      icon: "📊",
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      title: "Verified Users",
      value: dashboardData.user_verifications?.verified || 0, // Use optional chaining
      increase: "+25%",
      icon: "✅",
      bgColor: "bg-gradient-to-r from-pink-500 to-pink-600",
    },
  ];

  // Data for User Distribution (Doughnut Chart)
  const userDistributionData = {
    labels: ["Recruiters", "Students", "Admins"],
    datasets: [
      {
        data: [
          dashboardData.users_count?.recruiter || 0, // Use optional chaining
          dashboardData.users_count?.student || 0, // Use optional chaining
          dashboardData.users_count?.admin || 0, // Use optional chaining
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"], // Blue, Green, Orange
        hoverBackgroundColor: ["#2563eb", "#059669", "#d97706"],
      },
    ],
  };

  // Data for Internship Overview (Stacked Bar Chart)
  const internshipsBarData = {
    labels: ["Total Internships", "Active Internships", "Expired Internships"],
    datasets: [
      {
        label: "Internships",
        data: [
          dashboardData.internships?.total || 0, // Use optional chaining
          dashboardData.internships?.active || 0, // Use optional chaining
          dashboardData.internships?.expired || 0, // Use optional chaining
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#ef4444"], // Blue, Green, Red
        borderColor: ["#2563eb", "#059669", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  // Data for Recruiter Verification Status (Pie Chart)
  const recruiterVerificationData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [
          dashboardData.recruiter_verifications?.pending || 0, // Use optional chaining
          dashboardData.recruiter_verifications?.approved || 0, // Use optional chaining
          dashboardData.recruiter_verifications?.rejected || 0, // Use optional chaining
        ],
        backgroundColor: ["#f59e0b", "#10b981", "#ef4444"], // Orange, Green, Red
        hoverBackgroundColor: ["#d97706", "#059669", "#dc2626"],
      },
    ],
  };

  // Data for User Verification Status (Radial Bar Chart)
  const userVerificationProgress = (
    (dashboardData.user_verifications?.verified || 0) /
    ((dashboardData.user_verifications?.verified || 0) + (dashboardData.user_verifications?.unverified || 0)) *
    100
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/crud")}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105"
              >
                Manage Users
              </button>
              <button
                onClick={() => navigate("/admin/manage-internship")}
                className="bg-white text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105"
              >
                Manage Internships
              </button>
              <button
                onClick={handleLogout}
                className="bg-white text-red-600 hover:bg-red-50 font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
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
              <p className="text-sm mt-2">{stat.increase} Increased</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Distribution (Doughnut Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Distribution</h2>
            <div className="w-full h-64">
              <Doughnut
                data={userDistributionData}
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
          </div>

          {/* Internship Overview (Stacked Bar Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Internship Overview</h2>
            <div className="w-full h-64">
              <Bar
                data={internshipsBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                    tooltip: {
                      enabled: true,
                      mode: "index",
                      intersect: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: "#e5e7eb" },
                    },
                    x: {
                      grid: { display: false },
                    },
                  },
                  animation: {
                    duration: 1000,
                    easing: "easeInOutQuad",
                  },
                  barPercentage: 0.6,
                  categoryPercentage: 0.8,
                }}
              />
            </div>
          </div>

          {/* Recruiter Verification Status (Pie Chart) */}
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recruiter Verification Status</h2>
            <div className="w-full h-64">
              <Pie
                data={recruiterVerificationData}
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
          </div>
        </div>

        {/* User Verification Status and User Details Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* User Verification Status (1/3 of the row) */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Verification Status</h2>
            <div className="w-full h-64 flex items-center justify-center">
              <div className="text-4xl font-bold text-blue-500">{userVerificationProgress}%</div>
            </div>
          </div>

          {/* User Details Table (2/3 of the row) */}
          {/* User Details Table (2/3 of the row) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg overflow-x-auto transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Details</h2>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#3b82f6" }}> {/* Blue header */}
                    <TableCell sx={{ fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "white", borderBottom: "2px solid #3b82f6" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.user_details.map((user, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': { backgroundColor: "#f5f5f5" }, // Light gray hover color
                      }}
                    >
                      <TableCell component="th" scope="row" sx={{ borderBottom: "1px solid #e0e0e0" }}>
                        {user.name}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{user.email}</TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{user.role}</TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{user.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

        {/* Internship Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
          <Typography variant="h5" component="h2" fontWeight="bold" color="primary" gutterBottom>
            Internship Management
          </Typography>

          {/* Internship Table */}
          <TableContainer component={Paper} sx={{ maxHeight: "70vh", overflow: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: "#f59e0b", fontWeight: "bold", color: "white", borderBottom: "2px solid #f59e0b" }}>
                    Title
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#f59e0b", fontWeight: "bold", color: "white", borderBottom: "2px solid #f59e0b" }}>
                    Company
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#f59e0b", fontWeight: "bold", color: "white", borderBottom: "2px solid #f59e0b" }}>
                    Domain
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#f59e0b", fontWeight: "bold", color: "white", borderBottom: "2px solid #f59e0b" }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#f59e0b", fontWeight: "bold", color: "white", borderBottom: "2px solid #f59e0b" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#f59e0b", fontWeight: "bold", color: "white", borderBottom: "2px solid #f59e0b" }}>
                    Location
                  </TableCell>
                  <TableCell sx={{ backgroundColor: "#f59e0b", fontWeight: "bold", color: "white", borderBottom: "2px solid #f59e0b" }}>
                    Application Deadline
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.internships_list.map((internship, index) => (
                  <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: "#e0f7fa" } }}>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{internship.title}</TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{internship.company_name}</TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{internship.internship_domain || "N/A"}</TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{internship.type_of_internship || "N/A"}</TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{internship.internship_status}</TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{internship.location || "N/A"}</TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #e0e0e0" }}>{internship.application_deadline}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;