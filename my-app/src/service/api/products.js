import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" }, // Đặt header chung cho JSON
});

// Lấy danh sách sản phẩm
export const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy sản phẩm theo ID
export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error.response?.data || error.message);
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (id, productData) => {
  try {
    console.log("Updating product:", { id, productData }); // Log để kiểm tra dữ liệu
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Failed to update product:", error.response?.data || error.message);
    throw error;
  }
};

// Xóa sản phẩm
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error.response?.data || error.message);
    throw error;
  }
};

// Thêm sản phẩm mới
export const addProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy sản phẩm theo loại
export const fetchProductsByCategory = async (categoryId, gender = "") => {
  try {
    const response = await api.get(`/products/category/${categoryId}`, {
      params: { gender }, // Gửi query string cho backend
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category:", error.response?.data || error.message);
    throw error;
  }
};

//Lấy sản phẩm theo giới tính (meta_key = 'nam' hoặc 'nữ')
export const fetchProductsByGender = async (metaKey) => {
  try {
    const response = await api.get(`/meta/${metaKey}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for gender ${metaKey}:`, error.response?.data || error.message);
    throw error;
  }
};
