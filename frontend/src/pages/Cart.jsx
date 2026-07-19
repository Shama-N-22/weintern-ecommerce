import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, removeFromCart } from "../services/cartService";

function Cart() {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    getCart()
      .then((data) => setCart(data.cart || { items: [], totalAmount: 0 }))
      .catch((err) => {
        console.error("getCart failed:", err.response?.data || err.message);
        setError(err.response?.data?.message || `Failed to load cart: ${err.message}`);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>Shopping Cart</h1>
        <p className="lab-note">Loading your cart…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>Shopping Cart</h1>
        <p className="auth-error" style={{ maxWidth: 480 }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <>
          <h2 className="empty-state">Your cart is empty</h2>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>
            Browse Products
          </Link>
        </>
      ) : (
        <>
          {cart.items.map((item) => (
            <div className="product-card" key={item.product?._id || item._id}>
              {item.product?.image && (
                <img src={item.product.image} alt={item.product.name} className="product-image" />
              )}
              <h2>{item.product?.name || "Product"}</h2>
              <span className="price-tag">₹{item.price.toLocaleString("en-IN")}</span>
              <p>Quantity: {item.quantity}</p>

              <div className="product-card-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemove(item.product?._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <span>Total</span>
            <span className="price-tag">₹{cart.totalAmount.toLocaleString("en-IN")}</span>
          </div>

          <Link to="/checkout" className="btn btn-primary btn-checkout-cta">
            Proceed to Checkout →
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;
