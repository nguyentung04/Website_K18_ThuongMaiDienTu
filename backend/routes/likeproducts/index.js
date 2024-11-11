const express = require("express");
const router = express.Router();


const likeproductsController = require("../../controllers/likeproductsController");

router.get("/product/likes", likeproductsController.getAllProductLikes);
router.post('/product/:id/like', likeproductsController.toggleProductLike);


module.exports = router;