import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProvinceCityList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = 'YOUR_API_KEY'; // Thay YOUR_API_KEY bằng API Key của bạn

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/place/autocomplete/json',
          {
            params: {
              input: 'province in Vietnam',
              types: '(regions)',
              components: 'country:VN',
              key: API_KEY,
            },
          }
        );
        const locationNames = response.data.predictions.map(
          (item) => item.description
        );
        setLocations(locationNames);
      } catch (err) {
        setError('Lỗi khi lấy danh sách tỉnh/thành phố');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  return (
    <div>
      <h2>Danh sách tỉnh và thành phố tại Việt Nam</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {locations.map((location, index) => (
            <li key={index}>{location}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProvinceCityList;
