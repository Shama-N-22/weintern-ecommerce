import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../services/productService";
import { addToCart as addToCartAPI } from "../services/cartService";
import ProductModal from "../components/ProductModal";

const funFacts = [
  "The first computer mouse was carved out of wood in 1964.",
  "A modern smartphone has more processing power than the computers that landed Apollo 11 on the moon.",
  "The first 1GB hard drive (1980) weighed over 200 kg and cost $40,000.",
  "Wi-Fi doesn't stand for anything — it was just a catchy name made up for marketing.",
  "The QWERTY keyboard layout was designed to slow typists down and prevent mechanical jams.",
];

function Home() {
  const heroRef = useRef(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [factIndex, setFactIndex] = useState(0);
  const [activeProduct, setActiveProduct] = useState(null);
  const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setGlowPos({ x, y });
    };

    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, []);

  const nextFact = () => setFactIndex((prev) => (prev + 1) % funFacts.length);

  const addToCart = async (item, opts = {}) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    try {
      await addToCartAPI(item.id, 1);
      if (!opts.silent) alert(`${item.name} added to cart`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const trackRecentlyViewed = (item) => {
    const recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const updated = [item, ...recent.filter((p) => p.id !== item.id)].slice(0, 4);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  };

  return (
    <div>
      <section className="hero" ref={heroRef}>
        <div className="hero-overlay" />
        <div className="hero-glow" style={{ left: `${glowPos.x}%`, top: `${glowPos.y}%` }} />

        <div className="particles">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${(i * 97) % 100}%`,
                animationDelay: `${(i % 10) * 0.8}s`,
                animationDuration: `${8 + (i % 6)}s`,
              }}
            />
          ))}
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <span className="hero-eyebrow">PREMIUM ELECTRONICS</span>
          <h1 className="hero-brand">NEXTGEAR</h1>
          <p className="hero-tagline">Built for the obsessed.</p>
          <Link to="/shop" className="btn btn-primary btn-hero">
            Explore →
          </Link>
        </motion.div>
      </section>

      <motion.section
        className="story-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-eyebrow">Why NextGear</span>
        <h1>We tell you the truth about specs.</h1>
        <p className="story-lede">
          No marketing fog. No inflated benchmarks. Just gear that does what
          the box says — picked and tested by people who actually use it.
        </p>
        <div className="story-stats">
          <div className="story-stat">
            <span className="story-stat-number">50+</span>
            <span className="story-stat-label">Products tested in-house</span>
          </div>
          <div className="story-stat">
            <span className="story-stat-number">0</span>
            <span className="story-stat-label">Sponsored reviews</span>
          </div>
          <div className="story-stat">
            <span className="story-stat-number">7</span>
            <span className="story-stat-label">Categories, one honest catalog</span>
          </div>
        </div>
      </motion.section>

      <motion.div
        className="deals-banner"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <div>
          <h2>Season Deals — up to 20% off</h2>
          <p>Selected laptops, audio and gaming gear, this week only.</p>
        </div>
        <Link to="/shop" className="btn btn-primary">View Offers</Link>
      </motion.div>

      <motion.section
        className="rail-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="rail-title">Trending Now</h1>
        <div className="product-rail">
          {products.slice(0, 10).map((item) => (
            <div className="rail-item" key={item.id}>
              <div
                className="product-card"
                onClick={() => { trackRecentlyViewed(item); setActiveProduct(item); }}
              >
                <img src={item.image} alt={item.name} className="product-image" />
                <h2>{item.name}</h2>
                <span className="price-tag">₹{item.price.toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {recentlyViewed.length > 0 && (
        <section className="rail-section" style={{ paddingBottom: 20 }}>
          <button
            className="btn btn-outline recently-viewed-toggle"
            onClick={() => setShowRecentlyViewed((prev) => !prev)}
          >
            {showRecentlyViewed ? "Hide Recently Viewed" : "Show Recently Viewed"}
          </button>

          {showRecentlyViewed && (
            <div className="product-rail" style={{ marginTop: 18 }}>
              {recentlyViewed.map((item) => (
                <div className="rail-item" key={item.id}>
                  <div className="product-card" onClick={() => setActiveProduct(item)}>
                    <img src={item.image} alt={item.name} className="product-image" />
                    <h2>{item.name}</h2>
                    <span className="price-tag">₹{item.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <motion.section
        className="fun-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-eyebrow">Just for fun</span>
        <div className="fun-card" onClick={nextFact}>
          <span className="fun-label">Tech Fact #{factIndex + 1}</span>
          <p>{funFacts[factIndex]}</p>
          <span className="fun-hint">Tap for another one →</span>
        </div>
      </motion.section>

      <ProductModal
        item={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
}

export default Home;
