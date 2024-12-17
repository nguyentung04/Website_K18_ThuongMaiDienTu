import React, { useState, useEffect } from "react";
import { fetchProvinces, fetchDistricts } from "../../../service/api/city"; // Import các hàm đã cung cấp

const LocationSelector = () => {
  const [provinces, setProvinces] = useState([]); // Danh sách tỉnh/thành phố
  const [districts, setDistricts] = useState([]); // Danh sách quận/huyện
  const [selectedProvince, setSelectedProvince] = useState(""); // Tỉnh/thành phố được chọn
  const [loadingDistricts, setLoadingDistricts] = useState(false); // Trạng thái loading quận/huyện

  // Lấy danh sách tỉnh/thành phố khi component được render lần đầu
  useEffect(() => {
    const loadProvinces = async () => {
      const data = await fetchProvinces();
      setProvinces(data); // Lưu danh sách tỉnh/thành phố
    };

    loadProvinces();
  }, []);

  // Xử lý khi tỉnh/thành phố được chọn
   const handleProvinceChange = async (e) => {
    const selectedCode = e.target.value;
    setSelectedProvince(selectedCode); // Lưu mã tỉnh được chọn

    // Lấy danh sách quận/huyện theo tỉnh/thành phố được chọn
    setLoadingDistricts(true);
    try {
      const districtsData = await fetchDistricts();
      const provinceDistricts = districtsData.find(
        (province) => province.name === selectedCode
      );
      setDistricts(provinceDistricts ? provinceDistricts.districts : []);
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  return (
    <div>
      <h1>Chọn địa điểm</h1>

      {/* Select để chọn tỉnh/thành phố */}
      <div>
        <label htmlFor="province">Chọn Tỉnh/Thành phố:</label>
        <select id="province" onChange={handleProvinceChange} value={selectedProvince}>
          <option value="">-- Chọn tỉnh/thành phố --</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.name}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      {/* Select để chọn quận/huyện (hiển thị sau khi chọn tỉnh) */}
      <div>
        <label htmlFor="district">Chọn Quận/Huyện:</label>
        {loadingDistricts ? (
          <p>Đang tải danh sách quận/huyện...</p>
        ) : (
          <select id="district" disabled={districts.length === 0}>
            <option value="">-- Chọn quận/huyện --</option>
            {districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
