import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
     console.log("API Base URL being used:", API.defaults.baseURL);
    try {
      
      const isAdminEmail = email.endsWith("@example.com"); 
      const loginEndpoint = isAdminEmail ? "/admin/login" : "/login";

      const response = await API.post(loginEndpoint, { email, password });

      console.log("Login API Response:", response.data);

      if (response.data && response.data.access_token) {
        const { access_token, company_id, profile_complete } = response.data;

        // Decode the token to extract the role and other details
        let role = null,
          student_id = null;
        try {
          const payload = JSON.parse(atob(access_token.split(".")[1]));
          role = payload.role;
          student_id = payload.student_id;
        } catch (err) {
          console.error("JWT Decoding Error:", err);
          setMessage("Login failed due to invalid token.");
          return;
        }

        // Ensure the role is present in the token payload
        if (!role) {
          console.error("Role is missing in JWT payload!");
          setMessage("Login failed due to missing role.");
          return;
        }

        // Store user details in localStorage
        const user = {
          email,
          token: access_token,
          role,
          student_id,
          company_id,
          profile_complete,
        };
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", access_token);
        localStorage.setItem("role", role);
        if (student_id) localStorage.setItem("student_id", student_id);
        if (company_id) localStorage.setItem("company_id", company_id);

        setMessage("Login successful! Redirecting...");

        setTimeout(() => {
          if (role === "student") {
            navigate("/student-dashboard");
          } else if (role === "recruiter") {
            navigate("/recruiter-dashboard");
          } else if (role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/login");
          }
        }, 2000); 
      } else {
        setMessage(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error.response ? error.response.data : error);
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-600 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>

          <div className="mt-3 text-left">
            <Link to="/forgot-password" className="text-blue-500 text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;