import { useState } from "react";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Success :", data);
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.error("Server error:", error);
    }
  };

  return (
    <div className="page-container">
      <img src="/logo.png" alt="logo" className="logo" />

      <div className="left-side">
        <div className="login-container">
          <div className="Text">Welcome back</div>
          <div className="Subtext">login into your account to continue</div>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <div className="Subtext">forgot your password ?</div>
            <button type="submit">Sign in</button>
          </form>
          <div className="Text2">Dont have an account ? Sign up</div>
        </div>
      </div>

      <div className="right-side"></div>
    </div>
  );
}

export default Login;
