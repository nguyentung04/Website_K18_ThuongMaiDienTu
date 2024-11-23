const express = require('express');
const router = express.Router();
const commentController = require("../controllers/commentsController"); // Giữ nguyên như yêu cầu
const commentDetailController = require("../controllers/comment_detailController"); // Đổi tên cho rõ ràng hơn

// Lấy tất cả đánh giá theo product_id
router.get('/product/reviews/:product_id', commentController.getReviewsByProductID); 
// Thêm đánh giá cho sản phẩm
router.post('/product/reviews/:product_id', commentController.postReviewByProductID); 
// Lấy phản hồi cho chi tiết đánh giá
router.get('/product/reviews/reply/:detail_id', commentController.getRepliesByReviewDetailID); 
// Thêm phản hồi cho chi tiết đánh giá
router.post('/product/reviews/reply/:detail_id', commentController.postReplyByReviewDetailID); 
// Đếm số lượng phản hồi cho detail_id
router.get('/product/reviews/reply/count/:detail_id', commentController.getReplyCountByDetailID); 

module.exports = router;
