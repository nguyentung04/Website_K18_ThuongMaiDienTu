/* eslint-disable no-unused-vars */

import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const fetchOrdersDetail = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/order_items`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};
export const fetchAdminOrderDetailById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/order_items/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};
export const fetchOrderDetailById = async (userId, productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/order_items/${userId}/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};


// Function to update the status of an order
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${BASE_URL}/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const deleteOrderDetail = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/order_items/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};