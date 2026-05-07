import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../App.css";

// ✅ Products
const products = [
  { id: 1, name: "Shirt", price: 500, image: "shirt.jpg" },
  { id: 2, name: "Shoes", price: 1200, image: "shoes.jpg" },
  { id: 3, name: "Watch", price: 800, image: "watch.jpg" },
  { id: 4, name: "Bag", price: 1500, image: "bag.jpg" },
  { id: 5, name: "Jacket", price: 2000, image: "jacket.jpg" },
  { id: 6, name: "Sunglasses", price: 700, image: "sunglasses.jpg" },
  { id: 7, name: "Shorts", price: 700, image: "shorts.jpg" },
  { id: 8, name: "T-shirt", price: 700, image: "t-shirt.jpg" },
];

const quotes = [
  "Style is a way to say who you are without speaking 👗",
  "Fashion fades, but style is eternal ✨",
  "Dress like you're already famous 🔥",
  "Confidence is the best outfit 💯",
];

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);

  // 🔄 rotating quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>

      {/* 🔥 Banner */}
      <div className="banner">
        <h1>FW Fashion World</h1>
        <p>{quotes[index]}</p>
      </div>

      {/* 🛍️ Products */}
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">

            <img
              src={`/assets/${p.image}`}
              alt={p.name}
              className="product-img"
            />

            <h3>{p.name}</h3>
            <p className="price">₹{p.price}</p>

            <div className="btn-group">

              {/* ADD TO CART */}
              <button
                onClick={() => {
                  addToCart(p);
                  alert("Added to cart ✅");
                }}
              >
                Add to Cart
              </button>

              {/* BUY NOW */}
              <button
                className="buy"
                onClick={() => {
                  addToCart(p);
                  navigate("/checkout");
                }}
              >
                Buy Now
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;