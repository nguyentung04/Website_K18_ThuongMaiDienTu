import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

export const fetchPost_categories = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/post_categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const fetchPost_categoriesById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/post_categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const updatePost_categories = async (id, userData) => {
  try {
    // Log the User data being sent for debugging
    console.log("Updating post_categories:", { id, userData });

    // Perform the PUT request to update the User
    const response = await axios.put(`${BASE_URL}/post_categories/${id}`, userData, {
      headers: { "Content-Type": "application/json" }, // Correct header for JSON data
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Log and throw the error for proper error handling
    console.error("Failed to update product:", error);
    throw error;
  }
};

export const deletePost_categories = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/post_categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting post_categories:", error);
    throw error;
  }
};

export const addPost_categories = async (post_categoriesData) => {
  // Replace with your API endpoint and method to add a category
  const response = await fetch(`${BASE_URL}/post_categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post_categoriesData),
  });
  if (!response.ok) {
    throw new Error("Failed to add category");
  }
  return response.json();
};
