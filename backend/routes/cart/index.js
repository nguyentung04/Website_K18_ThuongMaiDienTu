const express = require("express");
const router = express.Router();


const cartController = require("../../controllers/cartController");
//cart
router.get("/cart", cartController.getAllcart);
router.get('/cart/:id', cartController.getCartById);
router.post("/cart", cartController.postCart);
router.put('/cart/:id', cartController.updateCartItems);
router.delete('/cart/:id', cartController.deleteCartItem);
router.delete('/cart_user_id/:user_id', cartController.deleteCartUser_id);
// router.get('/cart/:id', cartController.getcartById);

module.exports = router;