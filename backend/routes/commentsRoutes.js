const express = require('express');
const router = express.Router();
const commentsController = require("../controllers/commentsController");

// Đặt các route cho sản phẩm và bình luận
router.get("/product_reviews", commentsController.getAllReviews); // Lấy tất cả bình luận
router.get("/product_reviews/:id", commentsController.getReviewById); // Lấy bình luận theo ID
router.post("/product_reviews", commentsController.updateReviewCounts); // Cập nhật số lượng bình luận

// Các route khác cho bình luận theo sản phẩm
router.get("/product_reviews/:id", commentsController.getReviewsByProductID); // Lấy bình luận theo ID sản phẩm
router.post("/product_reviews/:id", commentsController.postReviewByProductID); // Thêm bình luận cho sản phẩm


module.exports = router;
