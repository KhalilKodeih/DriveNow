const router = require("express").Router();
const controller = require("../controllers/order.controller");

// CRUD routes
router.get("/", controller.getAllOrders);       // Get all orders
router.post("/", controller.createOrder);      // Rent a car
router.put("/:id/status", controller.updateOrderStatus); // Update status (completed/cancelled)

module.exports = router;
