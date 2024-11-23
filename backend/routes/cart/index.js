const express = require("express");
const router = express.Router();


const cartController = require("../../controllers/cartController");
//cart
router.get("/cart", cartController.getAllcart);
router.get('/cart/:id', cartController.getCartById);
router.post("/cart", cartController.postCart);
router.put('/cart/:id', cartController.updateCartItems);
router.delete('/cart/:id', cartController.deleteCartItem);
// router.get('/cart/:id', cartController.getcartById);

module.exports = router;