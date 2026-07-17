const Cart = require("../models/Cart");
const Product = require("../models/Product");

// User ka cart dekhna
const getCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId || req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "name price image"
    );

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        totalAmount: 0,
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch cart",
      error: error.message,
    });
  }
};

// Cart me product add karna
const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: product.price,
      });
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price image"
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to add product to cart",
      error: error.message,
    });
  }
};

// Cart item quantity update karna
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { productId, quantity } = req.body;

    if (!userId || !productId || Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID, product ID and quantity are required",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity = Number(quantity);

    cart.totalAmount = cart.items.reduce(
      (total, cartItem) =>
        total + cartItem.price * cartItem.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update cart",
      error: error.message,
    });
  }
};

// Cart se product remove karna
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to remove product from cart",
      error: error.message,
    });
  }
};

// Pura cart clear karna
const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalAmount = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to clear cart",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};