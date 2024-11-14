import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

export const fetchProductReviews = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/product_reviews`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product reviews:", error);
        throw error;
    }
};

export const fetchProductReviewById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/product_reviews/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product review by ID:", error);
        throw error;
    }
};

export const deleteProductReview = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/product_reviews/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product review:", error);
        throw error;
    }
};

export const updateProductReviewCounts = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/product_reviews`); // Make sure this endpoint matches your server route
        return response.data;
    } catch (error) {
        console.error("API Error: Unable to update product review counts", error.message);
        throw error; // This rethrows the error so that the calling code can handle it if needed
    }
};



