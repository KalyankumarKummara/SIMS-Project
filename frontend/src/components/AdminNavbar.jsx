import { useNavigate, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mapping route paths to navbar titles
  const pageTitles = {
    "/admin": "Admin Dashboard",
    "/admin/crud": "Manage Users",
    "/admin/manage-internship": "Manage Internships",
  };

  // Get the current title based on the path
  const currentTitle = pageTitles[location.pathname] || "Admin Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg sticky top-0 z-50 bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-2xl font-bold text-white">{currentTitle}</h1>
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
  );
};

export default AdminNavbar;
