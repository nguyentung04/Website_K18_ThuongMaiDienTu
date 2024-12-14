const express = require('express');
const router = express.Router();
const commentsController = require("../controllers/commentsController");

// Đặt các route cho sản phẩm và bình luận
router.get("/product_reviews", commentsController.getAllReviews); // Lấy tất cả bình luận
router.get("/product_reviews/:id", commentsController.getReviewById); // Lấy bình luận theo ID
router.post("/product_reviews", commentsController.postReviewByProductID); // Cập nhật số lượng bình luận

// Các route khác cho bình luận theo sản phẩm
router.get("/product_reviews/product/:productId", commentsController.getReviewsByProductID);  // Lấy bình luận theo ID sản phẩm
router.post("/product_reviews/:product_id", commentsController.postReviewByProductID); // Thêm bình luận cho sản phẩm
router.post("/replies", commentsController.postReplyByReviewDetailID);  // Đường dẫn API để tạo phản hồi
router.get("/replies/:reviewId", commentsController.getRepliesByReviewId);  // Lấy phản hồi theo reviewId
module.exports = router;
