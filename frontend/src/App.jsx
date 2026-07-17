import { useState } from "react";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

function App() {
  const [page, setPage] = useState("cart");

  return (
    <div>
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>WE Intern Shop</h2>

        <div style={styles.menu}>
          <button
            style={styles.button}
            onClick={() => setPage("cart")}
          >
            Cart
          </button>

          <button
            style={styles.button}
            onClick={() => setPage("wishlist")}
          >
            Wishlist
          </button>

          <button
            style={styles.button}
            onClick={() => setPage("checkout")}
          >
            Checkout
          </button>

          <button
            style={styles.button}
            onClick={() => setPage("success")}
          >
            Order Success
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        {page === "cart" && <Cart />}
        {page === "wishlist" && <Wishlist />}
        {page === "checkout" && <Checkout />}
        {page === "success" && <OrderSuccess />}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2874f0",
    padding: "15px 30px",
    color: "white",
  },

  logo: {
    margin: 0,
  },

  menu: {
    display: "flex",
    gap: "10px",
  },

  button: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "5px",
    background: "white",
    color: "#2874f0",
    cursor: "pointer",
    fontWeight: "bold",
  },

  container: {
    padding: "30px",
  },
};

export default App;