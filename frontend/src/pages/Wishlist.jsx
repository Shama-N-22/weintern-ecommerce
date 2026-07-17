function Wishlist() {
  return (
    <div>
      <h1>❤️ Wishlist</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
          width: "350px",
          marginTop: "20px",
        }}
      >
        <h3>Samsung Galaxy S25</h3>
        <p>Price: ₹74,999</p>

        <button style={styles.cartButton}>
          Add to Cart
        </button>

        <button style={styles.removeButton}>
          Remove
        </button>
      </div>
    </div>
  );
}

const styles = {
  cartButton: {
    background: "#2874f0",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },

  removeButton: {
    background: "#e53935",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Wishlist;