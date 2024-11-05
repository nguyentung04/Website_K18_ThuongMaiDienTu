// import axios from 'axios';

// // Đặt URL cơ sở
// const BASE_URL = "http://localhost:3000/api";

// // Hàm lấy danh sách thành phố
// export const fetchCities = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/cities`);
//       return response.data;
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error);
//       throw error;
//     }
//   };
  

// // Hàm lấy danh sách quận/huyện theo thành phố
// export const fetchDistrictsByCity = async (cityId) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/districts/${cityId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách quận/huyện:", error);
//     throw error;
//   }
// };
import axios from 'axios';

export const fetchProvinces = async () => {
  const response = await axios.get('https://provinces.open-api.vn/api/p');
  return response.data;
};

export const fetchDistricts = async () => {
  // Lấy danh sách tất cả tỉnh thành
  const provinces = await fetchProvinces();

  // Tạo một mảng để chứa danh sách quận huyện
  const districts = await Promise.all(provinces.map(async (province) => {
    const response = await axios.get(`https://provinces.open-api.vn/api/p/${province.code}`);
    return {
      name: province.name,
      districts: response.data.districts.map(district => district.name), // Lấy tên quận huyện
    };
  }));

  return districts;
};
