
const express = require('express');
const router = express.Router();

const product_detailController = require("../../controllers/product_detailController");

// Lấy tất cả chi tiết sản phẩm
router.get("/product_detail", product_detailController.getAllProduct_Details);

// Lấy danh sách sản phẩm chưa có trong bảng chi tiết sản phẩm
router.get("/product_not_in_the_table", product_detailController.getAllProduct_not_in_the_table);

// Lấy chi tiết sản phẩm theo ID
router.get("/product_detail/:id", product_detailController.getProductDetailById);

// Thêm mới chi tiết sản phẩm
router.post('/product_detail', product_detailController.postProductDetail);

// Cập nhật chi tiết sản phẩm
router.put("/product_detail/:id", product_detailController.updateProductDetail);
// router.delete("/product_detail/:id", product_detailController.product_detail);

// // Xóa chi tiết sản phẩm
// router.delete("/product_detail/:id", product_detailController.deleteProductDetail);

module.exports = router;
