/* eslint-disable no-unused-vars */

import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};


  

  export const fetchOrderById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  };

  export const deleteOrder = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  };
  
export const updateOrderStatus = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/order_detail/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};