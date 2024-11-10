const express = require("express");
const router = express.Router();

const postsCOntroller = require("../../controllers/postsController");

router.get("/posts", postsCOntroller.getAllposts);

router.get("/posts/:id", postsCOntroller.getPostsById);
router.delete("/posts/:id", postsCOntroller.deletePosts);
router.post("/posts", postsCOntroller.postPosts);
router.put("/posts/:id", postsCOntroller.updatePosts);

module.exports = router;