import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`); // Corrected URL
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    // Log the product data being sent for debugging
    console.log("Updating product:", { id, productData });

    const response = await axios.put(
      `${BASE_URL}/products/${id}`,
      productData,
      {
        headers: { "Content-Type": "application/json" }, // Correct header for JSON data
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update product:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await axios.post(`${BASE_URL}/products`, productData);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error.response ? error.response.data : error.message);
    throw error;
  }
};