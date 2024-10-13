import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as faStarSolid,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import "./Reviews.css";

const BASE_URL = "http://localhost:3000";

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString("vi-VN", options);
};

const Review = ({
  review,
  index,
  handleReplySubmit,
  toggleReplyForm,
  toggleReplies,
  showReplyForm,
  replyContents,
  showReplies,
  setReplyContents,
  fetchReplies,
}) => {
  return (
    <div className="review">
      <h3>{review.username}</h3>
      <div className="review-rating">
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={i < review.rating ? faStarSolid : faStarRegular}
            style={{ color: "#d0b349" }}
          />
        ))}
      </div>
      <div className="cmt-rep1">
        <p className="review-content">{review.content}</p>
        <p className="review-date">{formatDate(review.created_at)}</p>
      </div>

      <div className="review-actions">
        <button onClick={() => toggleReplyForm(index)} className="reply-button">
          Trả lời
        </button>
        <button
          onClick={() => {
            const isShowing = showReplies[index];
            toggleReplies(index);
            if (!isShowing) {
              fetchReplies(review.detail_id, index);
            }
          }}
          className="show-replies-button"
        >
          {showReplies[index] ? "Ẩn" : `${review.replyCount} phản hồi`}
        </button>
      </div>

      {showReplyForm[index] && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleReplySubmit(index, e);
          }}
          className="reply-form"
        >
          <textarea
            className="form-control"
            placeholder="Nhập nội dung phản hồi"
            value={replyContents[index] || ""}
            onChange={(e) =>
              setReplyContents({ ...replyContents, [index]: e.target.value })
            }
            required
          />
          <div className="rep_button">
            <button type="submit" className="replies_button">
              Gửi phản hồi
            </button>
          </div>
        </form>
      )}

      {showReplies[index] && (
        <div className="replies">
          {Array.isArray(review.replies) && review.replies.length > 0 ? (
            review.replies.map((reply) => (
              <div key={reply.id} className="reply">
                <h3>{reply.username}</h3>
                <div className="cmt-rep">
                  <p className="review-content">{reply.content}</p>
                  <p className="review-date">{formatDate(reply.created_at)}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Không có phản hồi nào.</p>
          )}
        </div>
      )}
    </div>
  );
};

const Reviews = ({ productId }) => {
  const evaluateRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [replyContents, setReplyContents] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const userId = JSON.parse(localStorage.getItem("userData")).id;

  const fetchReplyCount = async (reviewId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/product/reviews/reply/count/${reviewId}`
      );
      return response.data.replyCount; // Đã thay đổi từ 'count' thành 'replyCount'
    } catch (error) {
      console.error("Lỗi khi lấy số lượng phản hồi:", error);
      return 0; // Trả về 0 nếu có lỗi
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/product/reviews/${productId}`,
          {
            signal: controller.signal,
          }
        );

        const reviewsWithDetailID = await Promise.all(
          response.data.map(async (review) => {
            const replyCount = await fetchReplyCount(review.id);
            return {
              ...review,
              detail_id: review.id,
              replyCount: replyCount,
            };
          })
        );

        setReviews(reviewsWithDetailID);
      } catch (error) {
        if (error.name !== "AbortError") {
          setMessage("Lỗi khi lấy dữ liệu đánh giá");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
    return () => {
      controller.abort();
    };
  }, [productId]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!comment || userRating === 0) {
        setMessage("Vui lòng nhập nội dung và chọn đánh giá.");
        return;
      }

      const newReview = {
        product_id: productId,
        user_id: userId,
        content: comment,
        rating: userRating,
      };

      try {
        const response = await axios.post(
          `${BASE_URL}/api/product/reviews/${productId}`,
          newReview
        );

        const replyCount = await fetchReplyCount(response.data.id);

        setReviews((prev) => [
          { ...response.data, replyCount: replyCount },
          ...prev,
        ]);
        setComment("");
        setUserRating(0);
      } catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error);
        setMessage("Có lỗi xảy ra khi gửi đánh giá.");
      }
    },
    [comment, userRating, productId, userId]
  );

  const handleUserRatingClick = useCallback((index) => {
    setUserRating(index + 1);
  }, []);

  const toggleReplyForm = useCallback((index) => {
    setShowReplyForm((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const handleReplySubmit = useCallback(
    async (index, e) => {
      e.preventDefault();
      const replyContent = replyContents[index];

      if (!replyContent) {
        setMessage("Vui lòng nhập nội dung phản hồi.");
        return;
      }

      if (index < 0 || index >= reviews.length) {
        setMessage("Lỗi: Chỉ số phản hồi không hợp lệ.");
        return;
      }

      const reviewToReply = reviews[index];
      const detail_id = reviewToReply ? reviewToReply.detail_id : undefined;

      if (!detail_id) {
        setMessage("Lỗi: Không tìm thấy detail_id.");
        return;
      }



      try {
        const reply = {
          user_id: userId,
          content: replyContent,
          detail_id: detail_id,
        };

        const response = await axios.post(
          `${BASE_URL}/api/product/reviews/reply/${detail_id}`,
          reply
        );

        // Cập nhật số lượng phản hồi tại đây
        const newReplyCount = reviewToReply.replyCount + 1; // Tăng số lượng phản hồi lên 1

        setReviews((prev) =>
          prev.map((review, i) =>
            i === index
              ? {
                  ...review,
                  replies: [...(review.replies || []), response.data],
                  replyCount: newReplyCount, // Cập nhật số lượng phản hồi
                }
              : review
          )
        );

        setReplyContents((prev) => ({ ...prev, [index]: "" }));
       
      } catch (error) {
       
      }
    },
    [replyContents, reviews, userId]
  );

  const toggleReplies = useCallback((index) => {
    setShowReplies((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const fetchReplies = async (detailId, index) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/product/reviews/reply/${detailId}`
      );

      if (response.data.success) {
        const replies = Array.isArray(response.data.replies)
          ? response.data.replies
          : [];
        const newReplyCount = await fetchReplyCount(detailId);

        setReviews((prev) =>
          prev.map((review, i) =>
            i === index
              ? { ...review, replies: replies, replyCount: newReplyCount }
              : review
          )
        );
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy phản hồi:", error);
      setMessage("Có lỗi xảy ra khi lấy phản hồi.");
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div ref={evaluateRef} className="reviews-section">
      <h3 className="comment_title">ĐÁNH GIÁ</h3>
      {message && <div className="alert">{message}</div>}

      <div className="comment-box">
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
          <div className="form-floating comment-content">
            <textarea
              className="form-control"
              placeholder="Nhập nội dung"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit_button">
            Gửi đánh giá
          </button>
        </form>
        <div className="reviews-list">
          {reviews.map((review, index) => (
            <Review
              key={review.detail_id}
              review={review}
              index={index}
              handleReplySubmit={handleReplySubmit}
              toggleReplyForm={toggleReplyForm}
              toggleReplies={toggleReplies}
              showReplyForm={showReplyForm}
              replyContents={replyContents}
              setReplyContents={setReplyContents}
              showReplies={showReplies}
              fetchReplies={fetchReplies}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
