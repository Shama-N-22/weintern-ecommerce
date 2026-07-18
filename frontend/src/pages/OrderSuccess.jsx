function OrderSuccess() {
  const order = JSON.parse(localStorage.getItem("latestOrder"));

  if (!order) {
    return (
      <div className="page-container">
        <h1>No order found</h1>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>✅ Order Placed Successfully</h1>
      <h2>Thank you, {order.customer.fullName}</h2>
      <div className="order-summary">
        <p>Order ID: {order.id}</p>
        <p>Mobile: {order.customer.mobile}</p>
        <p>Address: {order.customer.address}</p>
        <p>Total Amount: ₹{order.totalAmount.toLocaleString("en-IN")}</p>
      </div>
    </div>
  );
}

export default OrderSuccess;
