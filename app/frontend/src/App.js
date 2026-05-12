import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
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

export default App;