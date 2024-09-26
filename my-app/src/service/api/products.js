import axios from "axios";
import request from "../../config/ApiConfig";



const BASE_URL = "http://localhost:3000/api";

export const fetchProducts = async () => {
  try {
    return await request({ method: "GET", path: `api/products` });
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};



export const updateProduct = async (id, productData) => {
  try {
    // Log the product data being sent for debugging
    console.log("Updating product:", { id, productData });

    // Perform the PUT request to update the product
    const response = await axios.put(
      `${BASE_URL}/products/${id}`,
      productData,
      {
        headers: { "Content-Type": "application/json" }, // Correct header for JSON data
      }
    );

    // Return the response data
    return response.data;
  } catch (error) {
    // Log and throw the error for proper error handling
    console.error("Failed to update product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
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
}


