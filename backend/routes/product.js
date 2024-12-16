const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

// Product routes
router.get("/products", productController.getAllProductsAdmin);
router.get("/products/:id", productController.getProductById);
router.post("/products", productController.addProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

// Additional routes
router.get("/products_banchay", productController.bestSellProducts);
router.get("/products_noibat", productController.featuredProducts);
router.get("/products_khuyenmai", productController.sellProducts);

// Lấy sản phẩm theo loại
router.get("/products/category/:categoryId", productController.getProductsByCategory);

router.get("/products/gender/:gender", productController.getProductsByGender);
// Lọc sản phẩm theo giá
router.get("/products/price-range/:range", productController.getProductsByPriceRange);

module.exports = router;
