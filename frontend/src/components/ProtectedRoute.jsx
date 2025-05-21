import { Navigate, Outlet, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Parse the user object
  const role = user?.role; // Get the role from the user object
  const companyId = user?.company_id; // Get the company_id from the user object
  const studentId = user?.student_id; // Get the student_id from the user object

  const { student_id, company_id } = useParams(); // Get student_id or company_id from the URL

  console.log("ProtectedRoute Check: Token =", token);
  console.log("ProtectedRoute Check: User =", user);
  console.log("ProtectedRoute Check: Role =", role);
  console.log("ProtectedRoute Check: Company ID =", companyId);
  console.log("ProtectedRoute Check: Student ID =", studentId);
  console.log("ProtectedRoute Check: URL Student ID =", student_id);
  console.log("ProtectedRoute Check: URL Company ID =", company_id);

  // Check if token is missing or invalid
  if (!token || token === "undefined") {
    console.error("Token is missing or invalid!");
    return <Navigate to="/login" replace />;
  }

  // Check if token is expired
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    if (decodedToken.exp < currentTime) {
      console.error("Token has expired!");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // Check if the route requires a specific role
  const path = window.location.pathname;

  // Allow access to recruiter-specific routes without requiring company_id in the URL
  if (path.startsWith("/internships") && role === "recruiter") {
    return <Outlet />;
  }

  // Additional check for recruiter routes that require company_id in the URL
  if (role === "recruiter" && company_id && company_id !== companyId) {
    console.error("Company ID in URL does not match logged-in user!");
    return <Navigate to="/login" replace />;
  }

  // Additional check for student routes that require student_id in the URL
  if (role === "student" && student_id && student_id !== studentId) {
    console.error("Student ID in URL does not match logged-in user!");
    return <Navigate to="/login" replace />;
  }

  // Additional check for admin routes
  if (path.startsWith("/admin") && role !== "admin") {
    console.error("Only admins can access this route!");
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;