const express = require("express");
const router = express.Router();
const {
  getUsers, updateUserRole, deleteUser,
  getAllOrders, updateOrderStatus,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");

router.get("/users", protect, getUsers);
router.put("/users/:id/role", protect, updateUserRole);
router.delete("/users/:id", protect, deleteUser);

router.get("/orders", protect, getAllOrders);
router.put("/orders/:id/status", protect, updateOrderStatus);

module.exports = router;
