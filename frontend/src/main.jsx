import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ThemeProvider, createTheme } from "@mui/material/styles"; 

const theme = createTheme({
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <BrowserRouter>
          {/* Wrap the App with ThemeProvider and pass the theme */}
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  </React.StrictMode>
);