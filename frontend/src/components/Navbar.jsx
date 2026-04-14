import { useNavigate } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    alert("Logged out successfully");
  };

  return (
    <div className="navbar">
      
      {/* 🔥 LOGO */}
      <div className="logo" onClick={() => navigate("/home")}>
        🛍️ FW Fashion
      </div>

      {/* 🔥 NAV LINKS */}
      <div className="nav-links">
        <span onClick={() => navigate("/home")}>Home</span>
        <span onClick={() => navigate("/cart")}>Cart</span>
        <span onClick={() => navigate("/blog")}>Blog</span>
        <span onClick={() => navigate("/contact")}>Contact</span>
      </div>

      {/* 🔥 LOGOUT BUTTON */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
};

export default Navbar;