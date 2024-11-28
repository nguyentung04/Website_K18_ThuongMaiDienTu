import React, { useEffect, useState } from 'react';
import { Select, Spinner, Text, Flex } from '@chakra-ui/react';
import { fetchDistricts } from '../../../service/api/city';

const LocationSelector = () => {
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const data = await fetchDistricts();
        setLocations(data);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      } finally {
        setLoadingLocations(false);
      }
    };

    getLocations();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const province = locations.find(loc => loc.name === selectedProvince);
      setDistricts(province ? province.districts : []);
    } else {
      setDistricts([]);
    }
  }, [selectedProvince, locations]);

  return (
    <Flex direction="column" gap={4}>
      <Text fontSize="xl" fontWeight="bold">Chọn Tỉnh/Thành phố và Quận/Huyện</Text>
      {loadingLocations ? (
        <Spinner />
      ) : (
        <>
          <Select
            placeholder="Chọn Tỉnh/Thành phố"
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            {locations.map((location, index) => (
              <option key={index} value={location.name}>
                {location.name}
              </option>
            ))}
          </Select>
          <Select placeholder="Chọn Quận/Huyện" isDisabled={!selectedProvince}>
            {districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </Select>
        </>
      )}
    </Flex>
  );
};

export default LocationSelector;
