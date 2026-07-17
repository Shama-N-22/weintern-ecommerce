const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

router.post("/place", placeOrder);
router.get("/user/:userId", getMyOrders);
router.get("/:orderId", getOrderById);
router.put("/cancel/:orderId", cancelOrder);

module.exports = router;