import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

const Login = () => {

  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle Login
  const handleLogin = () => {

    // Get user from localStorage
    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    console.log("Stored User:", storedUser);

    // Check account exists
    if (!storedUser) {

      alert("No account found. Please Sign Up");

      return;
    }

    // Validate credentials
    if (
      email.trim() === storedUser.email &&
      password.trim() === storedUser.password
    ) {

      // Save login status
      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      alert("Login Successful ✅");

      navigate("/home");

    } else {

      alert("Invalid Email or Password ❌");
    }
  };

  return (
    <div className="login-wrapper">

      <div className="login-box">

        {/* Logo */}
        <h1 className="logo">
          FW Fashion
        </h1>

        {/* Subtitle */}
        <p className="subtitle">
          Welcome back 👋
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {/* Login Button */}
        <button onClick={handleLogin}>
          Login
        </button>

        {/* Signup Redirect */}
        <p>
          Don't have an account?

          <span
            onClick={() =>
              navigate("/signup")
            }
            style={{
              color: "blue",
              cursor: "pointer",
              marginLeft: "5px",
            }}
          >
            Sign Up
          </span>

        </p>

      </div>

    </div>
  );
};

export default Login;