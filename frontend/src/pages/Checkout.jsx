function Checkout() {
  return (
    <div>
      <h1>💳 Checkout</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
          marginTop: "20px",
        }}
      >
        <h3>Delivery Details</h3>

        <input
          type="text"
          placeholder="Full Name"
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Mobile Number"
          style={styles.input}
        />

        <textarea
          placeholder="Delivery Address"
          style={styles.textarea}
        ></textarea>

        <h3>Total Amount: ₹69,999</h3>

        <button style={styles.button}>
          Place Order
        </button>
      </div>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },

  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },

  button: {
    background: "#2874f0",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default Checkout;