import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addToCart as addToCartAPI } from "../services/cartService";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlistItems")) || [];
    setWishlistItems(saved);
  }, []);

  const addToCart = async (item) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in to add items to your cart.");
      navigate("/login");
      return;
    }
    try {
      await addToCartAPI(item.id, 1);
      removeFromWishlist(item.id);
      alert(`${item.name} added to cart`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((previousItems) => {
      const updated = previousItems.filter((item) => item.id !== id);
      localStorage.setItem("wishlistItems", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="page-container">
      <h1>❤️ Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <>
          <h2 className="empty-state">
            Your wishlist is empty — tap the heart on any product in the Shop to save it here.
          </h2>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>
            Browse Products
          </Link>
        </>
      ) : (
        wishlistItems.map((item) => (
          <div className="product-card" key={item.id}>
            {item.image && (
              <img src={item.image} alt={item.name} className="product-image" />
            )}
            <h2>{item.name}</h2>
            <span className="price-tag">₹{item.price.toLocaleString("en-IN")}</span>
            <div className="product-card-actions">
              <button className="btn btn-primary" onClick={() => addToCart(item)}>Add to Cart</button>
              <button className="btn btn-danger" onClick={() => removeFromWishlist(item.id)}>Remove</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;
