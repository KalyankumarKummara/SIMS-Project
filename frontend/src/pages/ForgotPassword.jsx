import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    sendResetEmail();
  };

  const sendResetEmail = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const response = await API.post("/forgot_password", { email });
  
      if (response.data.reset_token) {
        setMessage("Email sent! Redirecting...");
        setTimeout(() => {
          navigate(`/reset-password/${response.data.reset_token}`);
        }, 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error sending reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleForgotPassword}>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border rounded-lg mb-4"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
        {message && <p className="text-center text-gray-600 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
