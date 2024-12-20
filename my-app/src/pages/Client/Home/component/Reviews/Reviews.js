import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import {
  fetchProductReviews,
  fetchProductReviewById,
  postReview,
  postReply,
} from "../../../../../service/api/comments";
import { fetchOrderDetailById } from "../../../../../service/api/order_items";
import "./Reviews.css";

const formatDate = (date) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    return "Ngày không hợp lệ";
  }
  const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return parsedDate.toLocaleDateString("vi-VN", options);
};


const Review = ({
  review,
  handleReplySubmit,
  toggleReplyForm,
  toggleReplies,
  showReplyForm,
  replyContents,
  setReplyContents,
  showReplies,
  replies,
}) => {

  const handleReplyToReplySubmit = (e, replyId) => {
    e.preventDefault();
    handleReplySubmit(e, review.review_id, replyId);
  };


  return (
    <div className="review">
      <div className="review-header">
        <div className="review-header-info">
          <strong>{review.username}</strong>
          <span className="review-date">{formatDate(review.created_at)}</span>
        </div>
        <div className="review-rating">
          {[...Array(5)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index < review.rating ? faStarSolid : faStarRegular}
              style={{ color: "#d0b349" }}
            />
          ))}
        </div>
      </div>
      <div className="review-body">
        <p>{review.content}</p>
        <div className="review-buttons">
          <button onClick={() => toggleReplies(review.review_id)}>
            {showReplies[review.review_id] ? "Ẩn trả lời" : "Hiện trả lời"}
          </button>
          <button onClick={() => toggleReplyForm(review.review_id)}>Trả lời</button>
        </div>
      </div>

      {showReplyForm[review.review_id] && (
        <form onSubmit={(e) => handleReplySubmit(e, review.review_id)} className="reply-form">
          <textarea
            value={replyContents[review.review_id] || ""}
            onChange={(e) =>
              setReplyContents({
                ...replyContents,
                [review.review_id]: e.target.value,
              })
            }
            placeholder="Nhập phản hồi..."
          />
          <button type="submit">Gửi phản hồi</button>
        </form>
      )}
      {showReplies[review.review_id] && replies[review.review_id]?.length > 0 && (
        <div className="replies">
          {replies[review.review_id].map((reply) => (
            <div key={reply.id} className="reply">
              <strong>{reply.message}</strong>
              <span>{formatDate(reply.created_at)}</span>
              <p>{reply.content}</p>
              <button onClick={(e) => handleReplyToReplySubmit(e, reply.id)}>Trả lời</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const Reviews = ({ productId }) => {
  const evaluateRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [replies, setReplies] = useState({});
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [replyContents, setReplyContents] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("userData"))?.id;

  useEffect(() => {
    if (!productId) {
      setMessage("Không có ID sản phẩm!");
      return;
    }

    const fetchReviews = async () => {
      try {
        const data = await fetchProductReviews(productId);
        setReviews(data);
        setLoading(false);
      } catch (error) {
        setMessage(`Bạn hãy là người đầu tiên đánh giá về sản phẩm...`);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRating === 0) {
      setMessage("Vui lòng chọn số sao trước khi gửi đánh giá!");
      return;
    }

    if (!userId || !productId) {
      setMessage("Vui lòng thanh toán và đánh giá sau!!!");
      return;
    }

    try {
      const orderDetail = await fetchOrderDetailById(userId, productId);
      const orderId = orderDetail?.order_id;

      if (!orderId) {
        setMessage("Vui lòng thanh toán để đánh giá sản phẩm!!");
        return;
      }

      const newReview = await postReview(productId, userId, userRating, comment, orderId);

      const scrollPosition = window.scrollY;

      window.location.reload();

      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);

      setMessage("Đánh giá thành công!");
    } catch (error) {
      console.error("Error posting review:", error);
      setMessage("Vui lòng đặt hàng và hãy quay lại đánh giá!!!");
    }
  };

  const handleUserRatingClick = (index) => {
    setUserRating(index + 1);
  };

  const toggleReplyForm = (reviewId) => {
    setShowReplyForm((prevState) => ({
      ...prevState,
      [reviewId]: !prevState[reviewId],
    }));
  };

  const toggleReplies = async (reviewId) => {
    if (!showReplies[reviewId]) {
      try {
        const data = await fetchProductReviewById(reviewId);
        setReplies((prev) => ({ ...prev, [reviewId]: data.replies }));
      } catch (error) {
        console.error("Error fetching review by ID:", error);
        setMessage(" ");
      }
    }
    setShowReplies((prevState) => ({
      ...prevState,
      [reviewId]: !prevState[reviewId],
    }));
  };

  const handleReplySubmit = async (e, reviewId, parentId) => {
    e.preventDefault();
    if (!userId) {
      setMessage("Vui lòng đăng nhập để trả lời!");
      return;
    }

    try {
      const content = replyContents[reviewId]; 
      const data = await postReply(reviewId, userId, content, parentId); 

      const scrollPosition = window.scrollY;

      setReplies((prev) => ({
        ...prev,
        [reviewId]: [...(prev[reviewId] || []), data], 
      }));

      setReplyContents((prev) => ({ ...prev, [reviewId]: "" }));
      setMessage("Phản hồi thành công!");

      window.location.reload();
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    } catch (error) {
      setMessage("Gửi phản hồi thất bại!");
    }
  };

  return (
    <div ref={evaluateRef} className="reviews-section">
      <h3 className="comment_title">ĐÁNH GIÁ</h3>
      {message && <div className="alert">{message}</div>}

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="comment-rating">
          {[...Array(5)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index < userRating ? faStarSolid : faStarRegular}
              style={{ color: "#d0b349", cursor: "pointer" }}
              onClick={() => handleUserRatingClick(index)}
            />
          ))}
        </div>
        <textarea
          className="form-control"
          placeholder="Nhập nội dung"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit" className="submit_button mt-3">
          Gửi đánh giá
        </button>
      </form>

      <div className="reviews-list">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          reviews.map((review) => (
            <Review
              key={review.review_id}
              review={review}
              handleReplySubmit={handleReplySubmit}
              toggleReplyForm={toggleReplyForm}
              toggleReplies={toggleReplies}
              showReplyForm={showReplyForm}
              replyContents={replyContents}
              setReplyContents={setReplyContents}
              showReplies={showReplies}
              replies={replies}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
