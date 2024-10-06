import axios from 'axios';

// Đặt URL cơ sở
const BASE_URL = "http://localhost:3000/api";

// Hàm lấy danh sách thành phố
export const fetchCities = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cities`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error);
      throw error;
    }
  };
  

// Hàm lấy danh sách quận/huyện theo thành phố
export const fetchDistrictsByCity = async (cityId) => {
  try {
    const response = await axios.get(`${BASE_URL}/districts/${cityId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách quận/huyện:", error);
    throw error;
  }
};
