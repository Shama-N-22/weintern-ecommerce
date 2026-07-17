import { useState } from "react";

function Checkout() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    address: "",
  });

  const [message, setMessage] = useState("");

  const cartItems =
    JSON.parse(localStorage.getItem("cartItems")) || [
      {
        id: 1,
        name: "Apple iPhone 15",
        price: 69999,
        quantity: 1,
      },
    ];

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (
      formData.fullName.trim() === "" ||
      formData.mobile.trim() === "" ||
      formData.address.trim() === ""
    ) {
      setMessage("Please fill all details.");
      return;
    }

    if (formData.mobile.length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    const orderData = {
      id: Date.now(),
      customer: formData,
      items: cartItems,
      totalAmount,
      status: "Placed",
    };

    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    localStorage.removeItem("cartItems");

    setMessage("Order placed successfully!");

    setTimeout(() => {
      window.location.href = "/order-success";
    }, 1000);
  };

  return (
    <div className="page-container">
      <h1>Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="checkout-form">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <input
          type="number"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
        />

        <h2>
          Total Amount: ₹{totalAmount.toLocaleString("en-IN")}
        </h2>

        {message && <p>{message}</p>}

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}

export default Checkout;