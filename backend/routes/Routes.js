const express = require("express");
const multer = require('multer');
const router = express.Router();

const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
const order_detailController = require("../controllers/order_detailController");
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
router.get("/products", productController.getAllProducts);
router.get("/products_banchay", productController.bestSellProducts);
router.get("/products_noibat", productController.featuredProducts);
router.get("/products_khuyenmai", productController.sellProducts);
router.get("/products/:id", productController.GetOneProduct);

//categoris
router.get("/categories", categoryController.getAllcategoris);

//orders
router.get("/orders", orderController.getAllOrders);
router.get('/ordersByName/:name', orderController.orderByName);
router.get('/orderByName1/:id', orderController.orderByName1);
router.post("/orders", orderController.PostOrders);
router.delete('/orders/:id', orderController.deleteOrder);
router.get('/orders/:id', orderController.getOrderById);

//orders_detail
router.get("/order_detail", order_detailController.getAllOrder_detail);
router.get('/order_detail/:id', order_detailController.getOrderDetailById);
router.put('/order_detail/:id', order_detailController.updateOrderDetailStatus);
// Authentication

// Define storage for multer
// User routes
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.postUsers);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Product routes
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.post('/products', productController.postProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

// Category routes
router.get("/categories", categoryController.getAllcategoris);
router.get("/categories/:id", categoryController.getCategoryById);
router.post("/categories", categoryController.postCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);
// Order routes
router.get("/orders", orderController.getAllOrders);

// Order detail routes
router.get("/order_detail", order_detailController.getAllOrder_detail);


module.exports = router;