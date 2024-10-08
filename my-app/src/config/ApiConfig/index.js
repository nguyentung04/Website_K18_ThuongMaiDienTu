import axios from "axios";

export const BASE_URL = "http://localhost:3000/"; // Update with your server URL

const request = async ({ method = "GET", path = "", data = {}, headers = {} }) => {
  try {
    const res = await axios({
      method: method,
      baseURL: BASE_URL,
      url: path,
      data: data,
      headers: {
        ...headers,
      },
    });

    return res.data;
  } catch (error) {
    alert(error?.response?.data?.message || "Error");
    return null;
  }
};

export default request;
