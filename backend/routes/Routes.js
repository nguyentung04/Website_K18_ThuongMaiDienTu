const express = require("express");
const multer = require('multer');
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
// const orderController = require("../controllers/orderController");

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

//categoris
router.get("/categories", categoryController.getAllCategories);
router.get("/product/categories/:id", categoryController.getAllCategories);

// //orders
// router.get("/orders", orderController.getAllOrders);
// router.get('/ordersByName/:name', orderController.orderByName);
// router.get('/orderByName1/:id', orderController.orderByName1);
// router.get('/orderDetail/:id', orderController.orderDetail);
// router.post("/orders", orderController.PostOrders);
// router.delete('/orders/:id', orderController.deleteOrder);
// router.get('/orders/:id', orderController.getOrderById);

// User routes
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.postUsers);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Product routes
router.get("/products", productController.getAllProductsAdmin);
router.get("/products/:id", productController.getProductById);
router.post("/products", productController.addProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

// Category routes
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.post("/categories", categoryController.postCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

// // Order routes
// router.get("/orders", orderController.getAllOrders);

module.exports = router;
