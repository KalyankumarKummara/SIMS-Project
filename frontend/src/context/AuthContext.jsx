import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      console.log("Saving user to localStorage:", user); // ✅ Debugging
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Updated login function to include student_id and company_id
  const login = (email, token, role, student_id, company_id) => {
    const userData = { email, token, role, student_id, company_id }; // Include both student_id and company_id

    console.log("Logging in user:", userData); // ✅ Debugging

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // ✅ Store in local storage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};