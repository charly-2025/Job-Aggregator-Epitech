import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Home from "./home";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage("home");
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setPage("login");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

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
