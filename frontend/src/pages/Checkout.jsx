import React from "react";

const API_URL = "https://susanveronica96.pythonanywhere.com";

// ✅ Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existing = document.getElementById("razorpay-script");

    if (existing) {
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

  const handlePayment = async () => {
    // ✅ Step 1: Load Razorpay
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      // ✅ Step 2: Create order
      const orderRes = await fetch(`${API_URL}/api/create-order/`, {
        method: "POST",
      });

      const orderData = await orderRes.json();

      console.log("Order Data:", orderData);

      if (!orderData.id) {
        alert("Order creation failed");
        return;
      }

      // ✅ Step 3: Setup options
      const options = {
        key: "rzp_test_SdjIuwz4rfGR3p", // 🔥 REPLACE with your real key
        amount: orderData.amount,
        currency: "INR",
        name: "FW Fashion",
        description: "Order Payment",
        order_id: orderData.id,

        // ✅ THIS IS YOUR HANDLER (FIXED)
       handler: async function (response) {
  console.log("Razorpay response:", response); // 👈 check this

  const res = await fetch(`${API_URL}/api/verify-payment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  });

  const data = await res.json();

  if (data.status === "success") {
    alert("✅ Payment Successful");
  } else {
    alert("❌ Payment Failed");
  }
},
        // ✅ Handle payment failure
        modal: {
          ondismiss: function () {
            alert("Payment popup closed");
          },
        },

        theme: {
          color: "#3399cc",
        },
      };

      // ✅ Step 4: Open Razorpay
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        alert("❌ Payment Failed");
      });

      rzp.open();

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Checkout</h2>
      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#3399cc",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;