import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(savedCart);
  }, []);

  const removeFromCart = (id, color) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.color === color)
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="page-container">
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <>
          <h2 className="empty-state">Your cart is empty</h2>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>
            Browse Products
          </Link>
        </>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="product-card" key={`${item.id}-${item.color}`}>
              {item.image && (
                <img src={item.image} alt={item.name} className="product-image" />
              )}
              <h2>{item.name}</h2>
              <span className="price-tag">₹{item.price.toLocaleString("en-IN")}</span>
              {item.color && <p>Color: {item.color}</p>}
              <p>Quantity: {item.quantity}</p>

              <div className="product-card-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => removeFromCart(item.id, item.color)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <span>Total</span>
            <span className="price-tag">₹{total.toLocaleString("en-IN")}</span>
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
