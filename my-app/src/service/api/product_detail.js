import axios from "axios";
import request from "../../config/ApiConfig";

const BASE_URL = "http://localhost:3000/api";

export const fetchProductDetail = async () => {
  try {
    return await request({ method: "GET", path: `api/product_detail` });
  } catch (error) {
    console.error("Error fetching product_detail:", error);
    throw error;
  }
};

export const fetchProduct_not_in_the_table = async () => {
  try {
    return await request({
      method: "GET",
      path: `api/product_not_in_the_table`,
    });
  } catch (error) {
    console.error("Error fetching product_detail:", error);
    throw error;
  }
};

export const fetchProductDetailById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/product_detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const updateProductDetail = async (id, productData) => {
  try {
    console.log("Updating productdetail:", { id, productData });

    const response = await axios.put(
      `${BASE_URL}/product_detail/${id}`,
      productData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    // Extract more information from the error response
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Server Error:", error.response.data);
      throw new Error(
        `Failed to update product: ${
          error.response.data.message || "Unknown error"
        }`
      );
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
      throw new Error("Failed to update product: No response from server");
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }
};

export const addProductDetail = async (productData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/product_detail`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error adding product:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const deleteProduct_detail = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/product_detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
