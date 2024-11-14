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

export const fetchOrderDetailById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/order_items/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Function to update the status of an order
export const updateOrderDetailStatus = async (orderId, statuss) => {
    try {
      const response = await axios.put(`${BASE_URL}/order_items/${orderId}`, { statuss });
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };