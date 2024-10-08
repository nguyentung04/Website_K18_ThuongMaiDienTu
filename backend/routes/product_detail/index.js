
const express = require('express');
const router = express.Router();

const product_detailController = require("../../controllers/product_detailController");

router.get("/product_detail", product_detailController.getAllProduct_Details);
router.get("/product_not_in_the_table", product_detailController.getAllProduct_not_in_the_table);
router.get("/product_detail/:id", product_detailController.getProductDetailById);
router.post('/product_detail', product_detailController.postProductDetail);
router.put("/product_detail/:id", product_detailController.updateProductDetail);


module.exports = router;