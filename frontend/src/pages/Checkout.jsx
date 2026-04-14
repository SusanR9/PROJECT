import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../App.css";
const API_URL = "https://youruser.pythonanywhere.com";
// ✅ Proper script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existing = document.querySelector("#razorpay-script");

    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart } = useContext(CartContext);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePayment = async () => {
    console.log("PAY CLICKED");

    if (total === 0) {
      alert("Cart is empty");
      return;
    }

    // ✅ Load Razorpay first
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert("Razorpay failed to load");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/create-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total }),
      });

      const data = await res.json();
      console.log("ORDER:", data);

      // ✅ Validate order
      if (!data.id) {
        console.error("Invalid order:", data);
        alert("Order creation failed");
        return;
      }

      const options = {
        key: "rzp_test_Sd16DwIJ6mzKC3", // 🔴 replace with your real key
        amount: data.amount,
        currency: "INR",
        order_id: data.id,

        handler: function (response) {
          alert("Payment Successful 🎉");

          window.location.href = `/success?payment_id=${response.razorpay_payment_id}`;
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("ERROR:", err);
      alert("Payment failed");
    }
  };

  return (
  <div className="checkout-page">

    {/* LEFT SIDE - PRODUCTS */}
    <div className="checkout-left">
      <h2>Order Summary</h2>

      {cart.map((item) => (
        <div key={item.id} className="checkout-item">

          <img src={item.image} alt={item.name} />

          <div>
            <h4>{item.name}</h4>
            <p>₹{item.price} × {item.quantity}</p>
          </div>

        </div>
      ))}
    </div>

    {/* RIGHT SIDE - PAYMENT */}
    <div className="checkout-right">

      <h2>Payment Details</h2>

      <div className="price-row">
        <span>Items Total</span>
        <span>₹{total}</span>
      </div>

      <div className="price-row">
        <span>Delivery</span>
        <span className="free">FREE</span>
      </div>

      <hr />

      <div className="price-row total">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      <button className="pay-btn" onClick={handlePayment}>
        Proceed to Payment 💳
      </button>

    </div>

  </div>
);
}
export default Checkout;