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
import "./Reviews.css";

// Hàm format ngày
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
    handleReplySubmit(e, review.review_id, replyId);  // Trả lời cho một bình luận đã có phản hồi
  };
  

  return (
    <div className="review">
      <div className="review-header">
        <strong>{review.username}</strong>
        <span className="review-date">{formatDate(review.created_at)}</span>
      </div>
      <div className="review-body">
        <p>{review.content}</p>
        <div className="review-rating">
          {[...Array(5)].map((_, index) => (
            <FontAwesomeIcon
              key={index}
              icon={index < review.rating ? faStarSolid : faStarRegular}
              style={{ color: "#d0b349" }}
            />
          ))}
        </div>
        <button onClick={() => toggleReplies(review.review_id)}>
          {showReplies[review.review_id] ? "Ẩn trả lời" : `Hiện trả lời || `}
        </button>
        <button onClick={() => toggleReplyForm(review.review_id)}>Trả lời</button>
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
              <strong>{reply.username}</strong>
              <span>{formatDate(reply.created_at)}</span>
              <p>{reply.content}</p>
              <button onClick={(e) => handleReplyToReplySubmit(e, reply.id)}>Trả lời</button> {/* Cập nhật này */}

              {/* Xử lý "Trả lời trên trả lời" */}
              {reply.replies && reply.replies.length > 0 && (
                <div className="nested-replies">
                  {reply.replies.map((nestedReply) => (
                    <div key={nestedReply.id} className="nested-reply">
                      <strong>{nestedReply.username}</strong>
                      <span>{formatDate(nestedReply.created_at)}</span>
                      <p>{nestedReply.content}</p>
                    </div>
                  ))}
                </div>
              )}
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
    if (!userId) {
      setMessage("Vui lòng đăng nhập để đánh giá!");
      return;
    }

    try {
      const data = await postReview(productId, userId, userRating, comment);
      setReviews([data, ...reviews]);
      setComment("");
      setUserRating(0);
      setMessage("Đánh giá thành công!");
    } catch (error) {
      console.log("Error posting review:", error);
      setMessage("Gửi đánh giá thất bại!");
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
        setMessage("Không thể tải phản hồi!");
      }
    }
    setShowReplies((prevState) => ({
      ...prevState,
      [reviewId]: !prevState[reviewId],
    }));
  };
  



  const handleReplySubmit = async (e, reviewId) => {
    e.preventDefault();
    if (!userId) {
      setMessage("Vui lòng đăng nhập để trả lời!");
      return;
    }
    try {
      const content = replyContents[reviewId];
      const data = await postReply(reviewId, userId, content);  // Gửi phản hồi đến API
      // Cập nhật lại danh sách phản hồi cho review
      setReplies((prev) => ({
        ...prev,
        [reviewId]: [...(prev[reviewId] || []), data],
      }));
      setReplyContents((prev) => ({ ...prev, [reviewId]: "" }));
      setMessage("Phản hồi thành công!");
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
        <button type="submit" className="submit_button">
          Gửi đánh giá
        </button>
      </form>

      <div className="reviews-list">
        {loading ? (
          <p>Đang tải...</p> // Hiển thị khi đang tải dữ liệu
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
