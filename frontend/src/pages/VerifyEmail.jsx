import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem("pendingVerificationEmail");
  const [email, setEmail] = useState(storedEmail || "");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!storedEmail) {
      navigate("/signup"); // ✅ Redirect if no email is stored
    }
  }, [navigate, storedEmail]);

  const handleVerify = async (e) => {
    e.preventDefault();
  
    // Convert token to a number
    const numericToken = Number(token);
    console.log("DEBUG: Token being sent:", numericToken, typeof numericToken);
  
    if (isNaN(numericToken)) {
      alert("Invalid token format. Please enter a valid numeric code.");
      return;
    }
  
    try {
      const response = await API.post("/verify-email", { email, token: numericToken });
  
      console.log("DEBUG: Response from backend:", response.data);
  
      if (response.data.status === "success") {
        alert("Email verified successfully! You can now log in.");
        localStorage.removeItem("pendingVerificationEmail");
        navigate("/login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Verification failed", error);
      alert("Verification failed. Please try again.");
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Verify Your Email
        </h2>
        <form onSubmit={handleVerify}>
          <p className="text-gray-600 text-sm mb-4">
            A verification code has been sent to <strong>{email}</strong>.
          </p>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter verification code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition mt-4"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
