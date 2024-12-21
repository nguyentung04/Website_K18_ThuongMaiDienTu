import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

export const fetchProductReviews = async (productId) => {
  try {
    const url = `${BASE_URL}/product_reviews/product/${productId}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw error;
  }
};

export const postReview = async (productId, userId, rating, content, orderId) => {
  try {
    if (!userId) {
      console.log("User not logged in");
      return; 
    }
    const response = await axios.post(`${BASE_URL}/product_reviews/${productId}`, {
      user_id: userId,
      content: content,
      rating: rating,
      order_id: orderId
    });
    return response.data;
  } catch (error) {
    console.error("Error posting review:", error);
    throw error;
  }
};

export const postReply = async (reviewId, userId, content, parentId = null) => {
  try {
    const response = await axios.post(`${BASE_URL}/replies`, {
      review_id: reviewId, 
      user_id: userId,
      content: content,
      parent_id: parentId
    });
    return response.data; 
  } catch (error) {
    console.error("Error posting reply:", error);
    throw error;
  }
};



export const fetchProductReviewById = async (reviewId) => {
  try {
    const response = await axios.get(`${BASE_URL}/replies/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    throw error;
  }
};

export const updateProductReviewCounts = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/product_reviews/count/${productId}`);
    return response.data; 
  } catch (error) {
    console.error("Error updating review counts:", error);
    throw error;
  }
};