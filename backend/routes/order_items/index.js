const express = require("express");
const router = express.Router();

const order_itemsController = require("../../controllers/order_itemsController");
//orders_detail
router.get("/order_items", order_itemsController.getAllorder_items);
router.get('/order_items/:id', order_itemsController.getOrderDetailById);
// router.put('/order_items/:id', order_itemsController.updateOrder_itemsDetailStatus);
router.delete('/order_items/:id', order_itemsController.deleteOrder_items);


module.exports = router;
