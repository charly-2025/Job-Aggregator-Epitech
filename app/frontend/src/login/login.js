import { useState } from "react";
import "./login.css";
 
function Login({ onLoginSuccess, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
 

    if (email && password) {
      onLoginSuccess?.({ email, firstname: email.split("@")[0] });
    } else {
      setError("Please enter your email and password.");
    }
  };
 
  return (
    <div className="page-container">
      <img src="/logo.png" alt="logo" className="logo" />
 
      <div className="left-side">
        <div className="login-container">
          <div className="Text">Welcome back</div>
          <div className="Subtext">Login into your account to continue</div>
 
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <div className="Subtext" style={{ cursor: "pointer" }}>
              Forgot your password?
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit">Sign in</button>
          </form>
 
          <div className="Text2">
            Don't have an account?{" "}
            <span className="link" onClick={onGoToRegister}>
              Sign up
            </span>
          </div>
        </div>
      </div>
 
      <div className="right-side"></div>
    </div>
  );
}
 
export default Login;
