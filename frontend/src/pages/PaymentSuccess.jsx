import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            fontSize: "70px",
            color: "green",
            marginBottom: "20px",
          }}
        >
          ✓
        </div>

        {/* Heading */}
        <h1
          style={{
            marginBottom: "15px",
            color: "#222",
          }}
        >
          Payment Successful
        </h1>

        {/* Message */}
        <p
          style={{
            color: "#666",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          Thank you for shopping with us.
          Your order has been placed successfully.
        </p>

        {/* Continue Shopping Button */}
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "14px 30px",
            backgroundColor: "#3399cc",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;