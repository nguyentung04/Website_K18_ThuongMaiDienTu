const express = require('express');
const router = express.Router();
const commentsController = require("../controllers/commentsController");

// Đặt các route cho sản phẩm và bình luận
router.get("/product_reviews", commentsController.getAllReviews); // Lấy tất cả bình luận
router.get("/product_reviews/:id", commentsController.getReviewById); // Lấy bình luận theo ID
router.post("/product_reviews", commentsController.updateReviewCounts); // Cập nhật số lượng bình luận

// Các route khác cho bình luận theo sản phẩm
router.get("/product_reviews/product/:product_id", commentsController.getReviewsByProductID); // Lấy bình luận theo ID sản phẩm
router.post("/product_reviews/product/:product_id", commentsController.postReviewByProductID); // Thêm bình luận cho sản phẩm

// // Route thêm phản hồi cho chi tiết bình luận và lấy phản hồi theo chi tiết bình luận
// router.post("/product_reviews/detail/:detail_id/reply", commentsController.postReplyByCommentDetailID); // Thêm phản hồi theo detail_id
// router.get("/product_reviews/detail/:detail_id/replies", commentsController.getRepliesByCommentDetailID); // Lấy danh sách phản hồi theo detail_id
// router.get("/product_reviews/detail/:detail_id/replyCount", commentsController.getReplyCountByDetailID); // Đếm số phản hồi theo detail_id

module.exports = router;
