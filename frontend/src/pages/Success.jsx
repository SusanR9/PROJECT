import { useLocation } from "react-router-dom";

const Success = () => {
  const query = new URLSearchParams(useLocation().search);
  const paymentId = query.get("payment_id");

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Payment Successful 🎉</h1>
      <p>Payment ID: {paymentId}</p>

      <a href="/home">
        <button>Continue Shopping 🛍️</button>
      </a>
    </div>
  );
};

export default Success;