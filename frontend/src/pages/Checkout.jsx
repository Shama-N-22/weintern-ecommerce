import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../services/cartService";
import { placeOrder } from "../services/orderService";

function Checkout() {
  // Best-effort display only — if this fails, it does NOT block placing
  // the order. The backend reads your real cart itself when you submit.
  const [displayTotal, setDisplayTotal] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCart()
      .then((data) => setDisplayTotal(data.cart?.totalAmount ?? null))
      .catch(() => setDisplayTotal(null)); // silently ignore — doesn't block anything
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setMessage("");

    const { fullName, mobileNumber, address, city, state, pinCode } = formData;
    if (!fullName.trim() || !mobileNumber.trim() || !address.trim() || !city.trim() || !state.trim() || !pinCode.trim()) {
      setMessage("Please fill in all shipping details.");
      return;
    }
    if (mobileNumber.trim().length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      await placeOrder(formData, "Cash on Delivery");
      setMessage("Order placed successfully!");
      setTimeout(() => navigate("/order-success"), 900);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="checkout-form">
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
        <input type="text" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
        <textarea name="address" placeholder="Delivery Address" value={formData.address} onChange={handleChange} />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
        <input type="text" name="pinCode" placeholder="PIN Code" value={formData.pinCode} onChange={handleChange} />

        <h2>
          {displayTotal !== null
            ? `Total Amount: ₹${displayTotal.toLocaleString("en-IN")}`
            : "Total will be calculated at checkout"}
        </h2>

        {message && <p>{message}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
