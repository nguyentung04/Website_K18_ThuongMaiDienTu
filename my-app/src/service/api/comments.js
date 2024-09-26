
import axios from "axios";
const BASE_URL = "http://localhost:3000/api";


export const fetchComments = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/comments`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  };
  
  export const fetchCommentsById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  };

  export const deleteComments = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  };


  export const updateCommentCounts = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/comments`); // Make sure this endpoint matches your server route
      return response.data;
    } catch (error) {
      console.error("API Error: Unable to update comment counts", error.message);
      throw error; // This rethrows the error so that the calling code can handle it if needed
    }
  };
  