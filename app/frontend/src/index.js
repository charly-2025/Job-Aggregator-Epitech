import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Home from "./home";

import {
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Box,
} from "@mui/material";

import theme from "./theme/theme";

const BASE_URL = "http://localhost:3001";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/userInfo`, {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setPage("home");
      } else {
        setPage("login");
      }
    } catch (err) {
      console.error(err);
      setPage("login");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage("home");
  };

  const handleRegisterSuccess = () => {
    setPage("login");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

  if (loading) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (page === "home") {
    return <Home user={user} onLogout={handleLogout} />;
  }

  if (page === "register") {
    return (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onGoToLogin={() => setPage("login")}
      />
    );
  }

  return (
    <Login
      Connected={handleLoginSuccess}
      onGoToRegister={() => setPage("register")}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>,
);
