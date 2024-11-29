const express = require("express");
const router = express.Router();


const cartController = require("../../controllers/cartController");
//cart
router.get("/cart", cartController.getAllcart);
router.get('/cart_userId/:id', cartController.getCartById);
router.post("/cart", cartController.postCart);
router.put('/cart/:id', cartController.updateCartItems);
router.delete('/cart/:userId/:productId', cartController.deleteCartItem);
router.delete('/cart_user_id/:id', cartController.deleteCartUser_id);
// router.get('/cart/:id', cartController.getcartById);

module.exports = router;