function Cart() {
  return (
    <div>
      <h1>Shopping Cart</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
          width: "350px",
        }}
      >
        <h3>Apple iPhone 15</h3>
        <p>Price: ₹69,999</p>
        <p>Quantity: 1</p>

        <button
          style={{
            padding: "10px 20px",
            background: "#2874f0",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default Cart;