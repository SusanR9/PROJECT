import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Cart = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="cart-container">
      <h1>Your Cart 🛒</h1>

      {cart.length === 0 ? (
        <p className="empty">Your cart is empty</p>
      ) : (
        <>
          {/* ✅ CART ITEMS */}
          {cart.map((item) => (
            <div key={item.id} className="cart-item">

              <img
                src={
                  item.image?.startsWith("http") || item.image?.startsWith("/static")
                    ? item.image
                    : `/static/${item.image}`
                }
                alt={item.name}
                className="cart-img"
              />

              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>

                <div className="cart-actions">
                  <div className="qty-controls">
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

            </div>
          ))}

          {/* ✅ SUMMARY OUTSIDE MAP */}
          <div className="cart-summary">
            <h2>Total: ₹{total}</h2>

            <button onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;