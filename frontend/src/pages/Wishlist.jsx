import { useState } from "react";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 2,
      name: "Samsung Galaxy S25",
      price: 74999,
      quantity: 1,
    },
  ]);

  const addToCart = (item) => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const alreadyExists = savedCart.find(
      (cartItem) => cartItem.id === item.id
    );

    let updatedCart;

    if (alreadyExists) {
      updatedCart = savedCart.map((cartItem) =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            }
          : cartItem
      );
    } else {
      updatedCart = [...savedCart, item];
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    setWishlistItems((previousItems) =>
      previousItems.filter((product) => product.id !== item.id)
    );

    alert(`${item.name} added to cart`);
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((previousItems) =>
      previousItems.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="page-container">
      <h1>❤️ Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <h2>Your wishlist is empty</h2>
      ) : (
        wishlistItems.map((item) => (
          <div className="product-card" key={item.id}>
            <h2>{item.name}</h2>
            <p>Price: ₹{item.price.toLocaleString("en-IN")}</p>

            <button onClick={() => addToCart(item)}>
              Add to Cart
            </button>

            <button onClick={() => removeFromWishlist(item.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;