const express = require("express");
const router = express.Router();


const orderController = require("../../controllers/orderController");
//orders
router.get("/orders", orderController.getAllOrders);
router.get("/orders/ordersOrderDelivered", orderController.orderByStatusOrderDelivered);
router.get("/orders/paid", orderController.orderByStatusPaid);
router.get("/orders/unpaid", orderController.orderByStatusUnpaid);
router.get('/ordersByName/:name', orderController.orderByName);
router.get('/orderByName1/:id', orderController.orderByName1);
router.get('/orderDetail/:id', orderController.orderDetail);
router.post("/orders", orderController.PostOrders);
router.delete('/orders/:id', orderController.deleteOrder);
// router.get('/orders/:id', orderController.getOrderById);

module.exports = router;