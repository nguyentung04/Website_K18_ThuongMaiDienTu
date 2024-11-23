const express = require('express');
const router = express.Router();
const commentController = require("../controllers/commentsController"); // Giữ nguyên như yêu cầu
const commentDetailController = require("../controllers/comment_detailController"); // Đổi tên cho rõ ràng hơn

// Lấy tất cả đánh giá theo product_id
router.get('/product/reviews/:product_id', commentController.getReviewsByProductID); // Sửa lại cho đúng
// Thêm đánh giá cho sản phẩm
router.post('/product/reviews/:product_id', commentController.postReviewByProductID); // Sửa lại cho đúng
// Lấy phản hồi cho chi tiết đánh giá
router.get('/product/reviews/reply/:detail_id', commentController.getRepliesByReviewDetailID); // Sửa lại cho đúng
// Thêm phản hồi cho chi tiết đánh giá
router.post('/product/reviews/reply/:detail_id', commentController.postReplyByReviewDetailID); // Sửa lại cho đúng
// Đếm số lượng phản hồi cho detail_id
router.get('/product/reviews/reply/count/:detail_id', commentController.getReplyCountByDetailID); // Sửa lại cho đúng

module.exports = router;
