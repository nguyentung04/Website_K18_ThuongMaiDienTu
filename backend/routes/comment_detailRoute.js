
const express = require('express');
const router = express.Router();

const comment_detailController = require("../controllers/comment_detailController");

router.get("/comment_detail", comment_detailController.getAllComment_detail);
router.get("/comment_detail/:id", comment_detailController.getCommentDetailById);
router.delete("/comment_detail/:id", comment_detailController.deleteComment_detail);


module.exports = router;