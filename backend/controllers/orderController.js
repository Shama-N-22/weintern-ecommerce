const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Naya order place karna
const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { shippingAddress, paymentMethod } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.mobileNumber ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pinCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress,
      totalAmount: cart.totalAmount,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to place order",
      error: error.message,
    });
  }
};

// User ke saare orders dekhna
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await Order.find({ user: userId })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
      error: error.message,
    });
  }
};

// Ek order ki details dekhna
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "items.product",
      "name price image"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch order",
      error: error.message,
    });
  }
};

// Order cancel karna
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be cancelled",
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to cancel order",
      error: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};