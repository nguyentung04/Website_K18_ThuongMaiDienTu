import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

export const fetchCategories = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const fetchCategoriesById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const updateCategory = async (id, userData) => {
  try {
    // Log the User data being sent for debugging
    console.log("Updating categories:", { id, userData });

    // Perform the PUT request to update the User
    const response = await axios.put(`${BASE_URL}/categories/${id}`, userData, {
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

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting categories:", error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  // Replace with your API endpoint and method to add a category
  const response = await fetch(`${BASE_URL}/categories`, {
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
