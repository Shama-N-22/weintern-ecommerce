function OrderSuccess() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
      }}
    >
      <h1 style={{ color: "green" }}>
        ✅ Order Placed Successfully!
      </h1>

      <h2>Thank You for Shopping 🛍</h2>

      <p>Your order has been placed successfully.</p>

      <p>
        Order ID: <strong>#WE123456</strong>
      </p>

      <button
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          background: "#2874f0",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default OrderSuccess;