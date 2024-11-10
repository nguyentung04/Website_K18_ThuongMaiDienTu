const express = require("express");
const router = express.Router();

const postsCOntroller = require("../../controllers/post_categoriesController");

router.get("/post_categories", postsCOntroller.getAllpost_categories);

router.get("/post_categories/:id", postsCOntroller.getPost_categoriesId);
router.delete("/post_categories/:id", postsCOntroller.deletePost_categories);
router.post("/post_categories", postsCOntroller.postPost_categories);
router.put("/post_categories/:id", postsCOntroller.updatePost_categories);

module.exports = router;