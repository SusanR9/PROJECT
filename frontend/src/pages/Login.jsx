import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");  
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">

        <h1 className="logo">FW Fashion</h1>
        <p className="subtitle">Welcome back 👋</p>

        <input type="email" placeholder="Enter Email" />
        <input type="password" placeholder="Enter Password" />

        <button onClick={handleLogin}>Login</button>

      <p>
  Don't have an account?
  <span onClick={() => navigate("/signup")}> Sign Up</span>
</p>

      </div>
    </div>
  );
};

export default Login;