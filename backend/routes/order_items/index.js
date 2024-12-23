const express = require("express");
const router = express.Router();
exports.router = router;

const order_itemsController = require("../../controllers/order_itemsController");

//orders_detail
router.get("/order_items", order_itemsController.getAllorder_items);
router.get('/order_items/:userId/:order_id', order_itemsController.getOrderClientDetailById );
router.get('/order_items/:id', order_itemsController.getAdminOrderDetailById);
// router.put('/order_items/:id', order_itemsController.updateOrder_itemsDetailStatus);
router.delete('/order_items/:id', order_itemsController.deleteOrder_items);



router.get('/order_items/:userId/:productId', order_itemsController.getOrderDetailByUserAndProduct);
module.exports = router;
