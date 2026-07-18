import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import products from "../data/products";
import ProductModal from "../components/ProductModal";

const MAX_COMPARE = 3;

function Shop() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeProduct, setActiveProduct] = useState(null);
  const [compareIds, setCompareIds] = useState(
    () => JSON.parse(localStorage.getItem("compareItems")) || []
  );
  const [wishlistIds, setWishlistIds] = useState(
    () => (JSON.parse(localStorage.getItem("wishlistItems")) || []).map((w) => w.id)
  );

  const categories = useMemo(
    () => ["All", ...new Set(products.map((p) => p.category))],
    []
  );

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const addToCart = (item, opts = {}) => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const alreadyExists = savedCart.find(
      (cartItem) => cartItem.id === item.id && cartItem.color === item.color
    );
    let updatedCart;

    if (alreadyExists) {
      updatedCart = savedCart.map((cartItem) =>
        cartItem.id === item.id && cartItem.color === item.color
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...savedCart, { ...item, quantity: 1 }];
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    trackRecentlyViewed(item);
    if (!opts.silent) alert(`${item.name} added to cart`);
  };

  const trackRecentlyViewed = (item) => {
    const recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const updated = [item, ...recent.filter((p) => p.id !== item.id)].slice(0, 4);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((cid) => cid !== id);
      } else {
        if (prev.length >= MAX_COMPARE) {
          alert(`You can compare up to ${MAX_COMPARE} products at a time.`);
          return prev;
        }
        updated = [...prev, id];
      }
      localStorage.setItem("compareItems", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleWishlist = (item) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    let updated;
    if (wishlist.some((w) => w.id === item.id)) {
      updated = wishlist.filter((w) => w.id !== item.id);
    } else {
      updated = [...wishlist, item];
    }
    localStorage.setItem("wishlistItems", JSON.stringify(updated));
    setWishlistIds(updated.map((w) => w.id));
  };

  return (
    <div className="page-container">
      <h1>Shop</h1>

      <div className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.map((item) => (
          <div
            className="product-card"
            key={item.id}
            onClick={() => {
              trackRecentlyViewed(item);
              setActiveProduct(item);
            }}
          >
            <div className="product-card-media">
              <img src={item.image} alt={item.name} className="product-image" />
              <div className="product-card-overlay">
                <span>View Product →</span>
              </div>
              <button
                className={`wishlist-heart ${wishlistIds.includes(item.id) ? "wishlist-heart-active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(item);
                }}
                aria-label="Toggle wishlist"
              >
                {wishlistIds.includes(item.id) ? "♥" : "♡"}
              </button>
            </div>
            <span className="product-category">{item.category}</span>
            <h2>{item.name}</h2>
            <span className="price-tag">₹{item.price.toLocaleString("en-IN")}</span>

            <label className="compare-check" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={compareIds.includes(item.id)}
                onChange={() => toggleCompare(item.id)}
              />
              Compare
            </label>

            <div className="product-card-actions">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart({ ...item, color: item.colors ? item.colors[0] : undefined });
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {compareIds.length > 0 && (
        <div className="compare-bar">
          <span>{compareIds.length} selected for comparison</span>
          <button className="btn btn-primary" onClick={() => navigate("/compare")}>
            Compare
          </button>
        </div>
      )}

      <ProductModal
        item={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
}

export default Shop;
