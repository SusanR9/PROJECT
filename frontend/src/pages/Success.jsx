import { useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const paymentId = query.get("payment_id");
  const orderId = query.get("order_id");

  return (
    <div className="success-page">
      <div className="success-card">
        <h1>🎉 Payment Successful</h1>

        <p><strong>Payment ID:</strong> {paymentId}</p>
        <p><strong>Order ID:</strong> {orderId}</p>

        <h3>Thank you for your purchase ❤️</h3>
        <button
  className="continue-btn"
onClick={() => window.location.href = "/home"}
>
  Continue Shopping 🛍️
</button>
      </div>
    </div>
  );
};

export default Success;