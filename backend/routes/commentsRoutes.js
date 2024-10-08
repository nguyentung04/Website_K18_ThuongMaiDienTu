
const express = require('express');
const router = express.Router();

const commentsController = require("../controllers/commentsController");



router.get("/comments", commentsController.getAllComments);
router.get("/comments/:id", commentsController.getCommentsById);
router.post("/comments",commentsController.postCommentCounts);

module.exports = router;