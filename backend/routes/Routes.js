const express = require("express");
const multer = require('multer');
const router = express.Router();

const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
// const order_detailController = require("../controllers/order_itemsController");
const orderController = require("../controllers/orderController");
// const authController = require("../controllers/authController");

//user
router.get("/users", userController.getAllUsers);
router.get("/login", userController.getAllUsers);
router.post("/login", userController.login);
router.get("/loginAdmin", userController.getAllUsers);
router.post("/loginAdmin", userController.loginAdmin);
router.post('/register', userController.register);


//products
router.get("/products", productController.getAllProductsAdmin);
router.get("/products_banchay", productController.bestSellProducts);
router.get("/products_noibat", productController.featuredProducts);
router.get("/products_khuyenmai", productController.sellProducts);
router.get("/products/:id", productController.GetOneProduct);
// router.get("/product/likes", productController.getAllProductLikes);
// router.post('/product/:id/like', productController.toggleProductLike);
// router.get("/productdetail/:id", productController.ProductDetail);

//categoris
router.get("/categories", categoryController.getAllCategories);

router.get("/product/categories/:id", categoryController.getAllCategories);



//orders
router.get("/orders", orderController.getAllOrders);
router.get('/ordersByName/:name', orderController.orderByName);
router.get('/orderByName1/:id', orderController.orderByName1);
router.get('/orderDetail/:id', orderController.orderDetail);
router.post("/orders", orderController.PostOrders);
router.delete('/orders/:id', orderController.deleteOrder);
router.get('/orders/:id', orderController.getOrderById);

//orders_detail
// router.get("/order_detail", order_detailController.getAllOrder_detail);
// router.get('/order_detail/:id', order_detailController.getOrderDetailById);
// router.put('/order_detail/:id', order_detailController.updateOrderDetailStatus);
// Authentication

// Define storage for multer
// User routes
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.postUsers);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Product routes
router.get("/products", productController.getAllProductsAdmin);
router.get("/products/:id", productController.getProductById);
// Thêm sản phẩm mới
router.post("/products", productController.addProduct);
// Cập nhật sản phẩm
router.put("/products/:id", productController.updateProduct);
// Xóa sản phẩm
router.delete("/products/:id", productController.deleteProduct);


// Category routes
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.post("/categories", categoryController.postCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

// Order routes
router.get("/orders", orderController.getAllOrders);

// Order detail routes
// router.get("/order_detail", order_detailController.getAllOrder_detail);//


module.exports = router;