import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

export const fetchPosts = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const fetchPostById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const updatePosts = async (id, postData) => {
  try {
    // Log the post data being sent for debugging
    console.log("Updating posts:", { id, postData });

    // Perform the PUT request to update the post
    const response = await axios.put(`${BASE_URL}/posts/${id}`, postData, {
      headers: { "Content-Type": "application/json" }, // Correct header for JSON data
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Log and throw the error for proper error handling
    console.error("Failed to update post:", error);
    throw error;
  }
};

export const deletePosts = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting posts:", error);
    throw error;
  }
};

export const addPosts = async (categoryData) => {
  // Replace with your API endpoint and method to add a category
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    throw new Error("Failed to add category");
  }
  return response.json();
};
export const fetchPostDetail = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post details:", error);
    throw error;
  }
};
