import { useEffect, useState } from "react";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    setCartItems(savedCart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(
      (item) => item.id !== id
    );

    setCartItems(updatedCart);
    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );
  };

  return (
    <div className="page-container">
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <h2>Your cart is empty</h2>
      ) : (
        cartItems.map((item) => (
          <div className="product-card" key={item.id}>
            <h2>{item.name}</h2>
            <p>Price: ₹{item.price.toLocaleString("en-IN")}</p>
            <p>Quantity: {item.quantity}</p>

            <button onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;