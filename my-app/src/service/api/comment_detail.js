
import axios from "axios";
const BASE_URL = "http://localhost:3000/api";


export const fetchCommentDetail = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/comment_detail`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  };
  
  export const fetchComment_detailById = async (id) => {
    try {
      console.log("Fetching comment detail for ID:", id); // Debugging log
      const response = await axios.get(`${BASE_URL}/comment_detail/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching comment details:", error);
      throw error;
    }
  };
  
  

  export const deleteComment_detail = async (id) => {
    // const id = req.params.id;
    console.log("Received ID to delete:", id);
    try {
      const response = await axios.delete(`${BASE_URL}/comment_detail/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting comment_detail:", error);
      throw error;
    }
  };