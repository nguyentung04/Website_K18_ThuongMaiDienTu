
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";
export const fetchCancelledOrderDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/ordersOrderCancelled`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  };