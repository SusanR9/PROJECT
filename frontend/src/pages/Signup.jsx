import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://127.0.0.1:8000/api/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup Successful 🎉");
      navigate("/");
    } else {
      alert(data.error);
    }

  } catch (err) {
    console.error(err);
    alert("Signup Successful 🎉");
  }
};

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2 className="brand">FW Fashion</h2>
        <h3>Create Account</h3>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Sign Up</button>

        </form>

        <p>
          Already have an account?
          <span onClick={() => navigate("/")}> Login</span>
        </p>

      </div>

    </div>
  );
};

export default Signup;