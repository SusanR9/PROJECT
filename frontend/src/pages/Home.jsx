import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../App.css";

// ✅ Products with images
const products = [
  { id: 1, name: "Shirt", price: 500, image: "/assets/shirt.jpg" },
  { id: 2, name: "Shoes", price: 1200, image: "/assets/shoes.jpg" },
  { id: 3, name: "Watch", price: 800, image: "/assets/watch.jpg" },
  { id: 4, name: "Bag", price: 1500, image: "/assets/bag.jpg" },
  { id: 5, name: "Jacket", price: 2000, image: "/assets/jacket.jpg" },
  { id: 6, name: "Sunglasses", price: 700, image: "/assets/sunglasses.jpg" },
  { id: 7, name: "Shorts", price: 700, image: "/assets/shorts.jpg" },
  { id: 8, name: "T-shirt", price: 700, image: "/assets/t-shirt.jpg" },
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

  // 🔄 rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>

      {/* 🔥 BANNER */}
      <div className="banner">
        <h1>FW Fashion World</h1>
        <p>{quotes[index]}</p>
      </div>

      {/* 🛍️ PRODUCTS */}
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">

            <img src={p.image} alt={p.name} className="product-img" />

            <h3>{p.name}</h3>
            <p className="price">₹{p.price}</p>

            <div className="btn-group">
              <button
                onClick={() => {
                  addToCart(p);
                  navigate("/cart");
                }}
              >
                Add to Cart
              </button>

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