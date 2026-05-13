import { useState } from "react";
import "./register.css";

function Register() {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(firstname, lastname, "Email:", email, "Password:", password);

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          lastname,
          firstname,
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
          <div className="Subtext">Sign up to JobGetter</div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
              placeholder="Last name"
            />
            <input
              type="text"
              value={lastname}
              onChange={(e) => setfirstname(e.target.value)}
              placeholder="First name"
            />
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
            <button type="submit">Sign up</button>
          </form>
          <div className="Text2">Already have an account ? Sign in</div>
        </div>
      </div>

      <div className="right-side"></div>
    </div>
  );
}

export default Register;
