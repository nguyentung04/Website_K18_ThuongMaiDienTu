const express = require("express");
const categoryController = require("../controllers/categoryController");
const router = express.Router();

// Category routes
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.post("/categories", categoryController.postCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

// Additional routes
router.get("/product/categories/:id", categoryController.getAllCategories);
module.exports = router;
