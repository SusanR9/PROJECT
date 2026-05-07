import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = "http://127.0.0.1:8000/api";

// ✅ Load Razorpay Script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById("razorpay-script");

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // ✅ Load cart from localStorage
  useEffect(() => {
    const storedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(storedCart);
  }, []);

  // ✅ Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ Handle Payment
  const handlePayment = async () => {
    // Load Razorpay SDK
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      // ✅ Create Order from Django Backend
      const response = await fetch(
        `${API_URL}/create_order/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount: total,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      // ✅ Razorpay Options
      const options = {
  key: data.key,
  amount: data.amount,
  currency: "INR",
  name: "FW Fashion",
  description: "Fashion Store Payment",
  order_id: data.order_id,

  method: {
    upi: true,
  },

  handler: async function (response) {

    const verifyResponse = await fetch(
      `${API_URL}/payment_verify/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(response),
      }
    );

    const verifyData =
      await verifyResponse.json();

    if (verifyData.status === "success") {

      localStorage.removeItem("cart");
      setCart([]);

      navigate("/success");

    } else {

      alert("Payment Verification Failed");
    }
  },

  prefill: {
    name: "Customer",
    email: "customer@example.com",
    contact: "9999999999",
  },

  theme: {
    color: "#3399cc",
  },

  modal: {
    ondismiss: function () {
      console.log("Payment popup closed");
    },
  },
};
      // ✅ Open Razorpay Popup
      const paymentObject =
        new window.Razorpay(options);

      paymentObject.open();

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
  <div
    style={{
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "40px 20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "30px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Title */}
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Checkout
      </h2>

      {/* Cart Empty */}
      {cart.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "18px",
              color: "#666",
            }}
          >
            Your cart is empty
          </p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          {/* Cart Items */}
{cart.map((item, index) => (
  <div
    key={index}
    style={{
      borderBottom: "1px solid #ddd",
      padding: "15px 0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
    }}
  >
    {/* Left Section */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}
    >
      {/* Product Image */}
     <img
  src={`/assets/${item.image}`}
  alt={item.name}
  style={{
    width: "90px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #ddd",
  }}
      />

      {/* Product Details */}
      <div>
        <h4
          style={{
            margin: "0 0 8px 0",
          }}
        >
          {item.name}
        </h4>

        <p
          style={{
            margin: "4px 0",
            color: "#666",
          }}
        >
          Price: ₹{item.price}
        </p>

        <p
          style={{
            margin: "4px 0",
            color: "#666",
          }}
        >
          Quantity: {item.quantity}
        </p>
      </div>
    </div>

    {/* Total */}
    <h4
      style={{
        minWidth: "80px",
        textAlign: "right",
      }}
    >
      ₹{item.price * item.quantity}
    </h4>
  </div>
))}

          {/* Total */}
          <div
            style={{
              marginTop: "25px",
              textAlign: "right",
            }}
          >
            <h2>Total: ₹{total}</h2>
          </div>

          {/* Pay Button */}
          <div
            style={{
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            <button
              onClick={handlePayment}
              style={{
                padding: "14px 35px",
                fontSize: "18px",
                backgroundColor: "#3399cc",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Pay Now
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);
};

export default Checkout;