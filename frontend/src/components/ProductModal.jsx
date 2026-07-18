import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SPEC_TEMPLATES = {
  Laptops: ["Intel Core i7 / Ryzen 7", "16GB RAM", "512GB SSD", "14-hour battery life"],
  Phones: ["6.5\" AMOLED display", "128GB storage", "5000mAh battery", "50MP main camera"],
  PCs: ["RTX-class GPU", "32GB RAM", "1TB NVMe SSD", "Liquid cooling"],
  Audio: ["Active noise cancellation", "30-hour battery", "Bluetooth 5.3", "IPX4 water resistance"],
  Displays: ["165Hz refresh rate", "1ms response time", "HDR400", "USB-C 90W passthrough"],
  Accessories: ["Hot-swappable switches", "Wireless + wired mode", "RGB backlight", "USB-C rechargeable"],
  Wearables: ["7-day battery", "Heart rate + SpO2", "Water resistant 5ATM", "GPS built-in"],
};

const COLOR_SWATCH = {
  Black: "#111111", White: "#f2f2f2", Silver: "#c7c7c7", "Space Gray": "#4a4a4a",
  "Midnight Black": "#0a0a0a", Blue: "#2b5dbb", Red: "#b32020", Navy: "#1c2a4a",
  Cream: "#e8dcc5", Gunmetal: "#3a3f44", Pink: "#e08fb0", "Rose Gold": "#caa08a",
};

function ProductModal({ item, onClose, onAddToCart }) {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (!item) return;
    setSelectedColor(item.colors ? item.colors[0] : null);
    const wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    setInWishlist(wishlist.some((w) => w.id === item.id));
  }, [item]);

  if (!item) return null;

  const specs = SPEC_TEMPLATES[item.category] || [];

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    let updated;
    if (wishlist.some((w) => w.id === item.id)) {
      updated = wishlist.filter((w) => w.id !== item.id);
      setInWishlist(false);
    } else {
      updated = [...wishlist, item];
      setInWishlist(true);
    }
    localStorage.setItem("wishlistItems", JSON.stringify(updated));
  };

  const handleAddToCart = () => {
    onAddToCart({ ...item, color: selectedColor });
    onClose();
  };

  const handleBuyNow = () => {
    onAddToCart({ ...item, color: selectedColor }, { silent: true });
    onClose();
    navigate("/checkout");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <img src={item.image} alt={item.name} className="modal-image" />

        <div className="modal-body">
          <span className="product-category">{item.category}</span>
          <h2>{item.name}</h2>
          <span className="price-tag">₹{item.price.toLocaleString("en-IN")}</span>

          {item.colors && item.colors.length > 0 && (
            <div className="color-picker">
              <span className="color-picker-label">
                Color: <strong>{selectedColor}</strong>
              </span>
              <div className="color-swatches">
                {item.colors.map((color) => (
                  <button
                    key={color}
                    className={`color-swatch ${selectedColor === color ? "color-swatch-active" : ""}`}
                    style={{ background: COLOR_SWATCH[color] || "#888" }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          <ul className="modal-specs">
            {specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>

          <p className="modal-desc">
            Picked and tested in-house — real specs, no marketing fog. Ships
            in 2-4 business days with a 1-year warranty.
          </p>

          <div className="modal-actions">
            <button className="btn btn-primary btn-buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="btn btn-outline" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button
              className={`btn btn-wishlist ${inWishlist ? "btn-wishlist-active" : ""}`}
              onClick={toggleWishlist}
              aria-label="Toggle wishlist"
            >
              {inWishlist ? "♥ In Wishlist" : "♡ Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
