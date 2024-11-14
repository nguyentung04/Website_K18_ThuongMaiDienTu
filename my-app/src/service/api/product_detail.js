import axios from "axios";

const BASE_URL = "http://localhost:3000/api"; // Đổi thành API endpoint của bạn

// Lấy tất cả chi tiết sản phẩm
export const fetchProductDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/product_detail`);
    return response.data || []; // Nếu response.data là null, trả về mảng rỗng
  } catch (error) {
    console.error("Error fetching product details:", error);
    return []; // Trả về mảng rỗng khi có lỗi
  }
};

// Lấy danh sách sản phẩm chưa có trong bảng chi tiết sản phẩm
export const fetchProductsNotInTable = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/product_not_in_the_table`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products not in table:", error);
    return null;
  }
};

// Lấy chi tiết sản phẩm theo ID
export const fetchProductDetailById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/product_detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

// Thêm mới chi tiết sản phẩm
export const addProductDetail = async (productData) => {
  try {
    const response = await axios.post(`${BASE_URL}/product_detail`, productData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product detail:", error);
    return null;
  }
};

// Cập nhật chi tiết sản phẩm
export const updateProductDetail = async (id, productData) => {
  try {
    const response = await axios.put(`${BASE_URL}/product_detail/${id}`, productData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product detail:", error);
    return null;
  }
};

// Xóa chi tiết sản phẩm
export const deleteProductDetail = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/product_detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product detail:", error);
    return null;
  }
};
