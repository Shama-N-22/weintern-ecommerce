import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, cancelOrder } from "../services/orderService";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getMyOrders()
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.response?.data?.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (orderId) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await cancelOrder(orderId);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>My Orders</h1>
        <p className="lab-note">Loading your orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>My Orders</h1>
        <p className="auth-error" style={{ maxWidth: 480 }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <>
          <h2 className="empty-state">You haven't placed any orders yet.</h2>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Products</Link>
        </>
      ) : (
        orders.map((order) => {
          const canCancel = !["Delivered", "Cancelled"].includes(order.orderStatus);

          return (
            <div className="order-summary" key={order._id} style={{ maxWidth: 640, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>
                  Order #{order._id.slice(-8).toUpperCase()}
                </span>
                <span className="tech-chip">{order.orderStatus}</span>
              </div>

              {order.items.map((item, i) => (
                <p key={i}>{item.name} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
              ))}

              <p style={{ marginTop: 10, fontWeight: 600 }}>
                Total: ₹{order.totalAmount.toLocaleString("en-IN")}
              </p>
              <p>Ships to: {order.shippingAddress?.city}, {order.shippingAddress?.state}</p>

              {canCancel && (
                <button className="btn btn-danger" style={{ marginTop: 12 }} onClick={() => handleCancel(order._id)}>
                  Cancel Order
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyOrders;
