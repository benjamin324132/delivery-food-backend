const express = require("express");
const router = express.Router();
const {
  addNewOrder,
  getOrders,
  getUserOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderControllers");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(protect, admin, getOrders).post(protect, addNewOrder);
router.route("/myorders").get(protect, getUserOrders);
router
  .route("/:id")
  .get(protect, getOrderById)
  .put(protect, updateOrder)
  .delete(protect, admin, deleteOrder);

module.exports = router;
