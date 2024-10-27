
const express = require('express');
const router = express.Router();
const commentController = require("../controllers/commentsController");
const comment_detailController = require("../controllers/comment_detailController");

router.get("/comment_detail", comment_detailController.getAllComment_detail);
router.get("/comment_detail/:id", comment_detailController.getCommentDetailById);
router.delete("/comment_detail/:id", comment_detailController.deleteComment_detail);

//tung
//lay all cmt theo pro_id
router.get('/product/reviews/:product_id', commentController.getCommentsByProductID);
//them bình luận
router.post('/product/reviews/:product_id', commentController.postCommentByProductID);
//lấy reply cmt
router.get('/product/reviews/reply/:detail_id', commentController.getRepliesByCommentDetailID);
router.post('/product/reviews/reply/:detail_id', commentController.postReplyByCommentDetailID);
router.get('/product/reviews/reply/count/:detail_id', commentController.getReplyCountByDetailID);



module.exports = router;