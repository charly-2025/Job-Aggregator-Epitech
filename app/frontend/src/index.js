import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Login from "./login/login";
import Register from "./register/register";
import Home from "./home";
 
function App() {

  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
 
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage("home");
  };
 
  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setPage("home");
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
      onLoginSuccess={handleLoginSuccess}
      onGoToRegister={() => setPage("register")}
    />
  );
}
 
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
