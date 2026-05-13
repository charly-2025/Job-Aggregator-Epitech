import { useState } from "react";
import "./register.css";
 
function Register({ onRegisterSuccess, onGoToLogin }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
 

    if (email && password && firstname && lastname) {
      onRegisterSuccess?.({ email, firstname, lastname });
    } else {
      setError("Please fill in all fields.");
    }
  };
 
  return (
    <div className="page-container">
      <img src="/logo.png" alt="logo" className="logo" />
 
      <div className="left-side">
        <div className="login-container">
          <div className="Text">Create account</div>
          <div className="Subtext">Sign up to JobGetter</div>
 
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Last name"
              required
            />

            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="First name"
              required
            />
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
            {error && <div className="error-msg">{error}</div>}
            <button type="submit">Sign up</button>
          </form>
 
          <div className="Text2">
            Already have an account?{" "}
            <span className="link" onClick={onGoToLogin}>
              Sign in
            </span>
          </div>
        </div>
      </div>
 
      <div className="right-side"></div>
    </div>
  );
}
 
export default Register;
