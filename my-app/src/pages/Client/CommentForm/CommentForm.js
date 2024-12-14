import React, { useState, useEffect } from "react";
import { fetchProductReviews, postReview } from "../../../service/api/comments";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    content: "",
    rating: 1,
  });

  // Lấy bình luận từ API
  useEffect(() => {
    const getReviews = async () => {
      try {
        const data = await fetchProductReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews", error);
      }
    };
    getReviews();
  }, [productId]);

  // Xử lý gửi bình luận mới
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await postReview(productId, newReview);
      setNewReview({ content: "", rating: 1 }); // Reset form
      // Lấy lại danh sách bình luận sau khi thêm mới
      const updatedReviews = await fetchProductReviews(productId);
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error posting review", error);
    }
  };

  return (
    <div>
      <h2>Product Reviews</h2>
      
      {/* Hiển thị bình luận */}
      <div>
        {reviews.map((review) => (
          <div key={review.id}>
            <p><strong>{review.username}</strong> (Rating: {review.rating})</p>
            <p>{review.content}</p>
            <p><em>{new Date(review.created_at).toLocaleString()}</em></p>
          </div>
        ))}
      </div>
      
      {/* Form thêm bình luận */}
      <form onSubmit={handleSubmitReview}>
        <div>
          <label>Rating:</label>
          <select
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={newReview.content}
            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
            required
          />
        </div>
        <button type="submit">Post Review</button>
      </form>
    </div>
  );
};

export default ProductReviews;
