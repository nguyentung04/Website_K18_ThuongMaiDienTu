import axios from "axios";

export const BASE_URL = "http://localhost:3000/"; // Update with your server URL

const request = async ({ method = "GET", path = "", data = {}, headers = {} }) => {
  try {
    const res = await axios({
      method,
      baseURL: BASE_URL,
      url: path,
      data,
      headers: {
        ...headers,
      },
    });

    // Kiểm tra phản hồi thành công
    if (res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      // Xử lý các phản hồi không phải 2xx
      console.error("Yêu cầu không thành công:", res.status, res.data);
      throw new Error(res.data?.message || "Yêu cầu không thành công");
    }
  } catch (error) {
    // Sử dụng cách thân thiện hơn với người dùng để xử lý lỗi
    console.error("API Error:", error);
    const errorMessage = error?.response?.data?.message || "Đã xảy ra lỗi không mong muốn";
    alert(errorMessage); // Bạn có thể thay thế điều này bằng thông báo toast trong một ứng dụng thực tế
    return null;
  }
};

export default request;