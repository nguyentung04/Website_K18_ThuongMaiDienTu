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
  try {
    const provinces = await fetchProvinces();

    const districts = await Promise.all(provinces.map(async (province) => {
      const response = await axios.get(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
      
      // Kiểm tra xem API có trả về danh sách quận huyện không
      if (response.data && response.data.districts) {
        return {
          name: province.name,
          districts: response.data.districts.map(district => district.name), // Lấy tên quận huyện
        };
      }
      return { name: province.name, districts: [] }; // Trường hợp không có quận huyện
    }));

    return districts;
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
};

