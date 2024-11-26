const express = require("express");
const userRoutes = require("./user");
const productRoutes = require("./product");
const categoryRoutes = require("./category");
const router = express.Router();

router.use(userRoutes);
router.use(productRoutes);
router.use(categoryRoutes);

module.exports = router;