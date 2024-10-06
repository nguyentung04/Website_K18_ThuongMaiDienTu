import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  FormErrorMessage,
  useToast,
  Text,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchDistrictsById,
  updateDistricts,
} from "../../../../service/api/districts";
// Fetch all provinces (cities) for the dropdown
import { fetchCities } from "../../../../service/api/cities"; // Ensure this API exists and fetches provinces

const EditDistricts = () => {
  const [name, setName] = useState("");
  const [province, setProvince] = useState(""); // State to hold the selected province
  const [provinces, setProvinces] = useState([]); // State to hold the list of provinces
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue("white", "gray.800");

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên thương hiệu là bắt buộc.";
    return newErrors;
  };

  useEffect(() => {
    const getDistrictDetails = async () => {
      try {
        const districtData = await fetchDistrictsById(id);
        if (districtData) {
          setName(districtData.name || "");
          setProvince(districtData.cityId || ""); // Assuming cityId is part of the district data
        }
      } catch (error) {
        toast({
          title: "Lỗi khi tải Quận.",
          description: "Không thể lấy thông tin chi tiết về Quận.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Không thể lấy Quận:", error);
      }
    };
  
    const loadProvinces = async () => {
      try {
        const provincesData = await fetchCities(); // Fetch list of provinces (cities)
        setProvinces(provincesData); // Assuming the API returns a list of provinces (cities)
      } catch (error) {
        console.error("Lỗi khi tìm kiếm tỉnh:", error);
      }
    };
  
    getDistrictDetails();
    loadProvinces(); // Fetch provinces separately
  }, [id, toast]);
  

const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  const districtData = { name, city_id: province }; // Send the selected province (cityId)

  try {
    await updateDistricts(id, districtData);
    toast({
      title: "Quận đã cập nhật.",
      description: "Chi tiết quận đã được cập nhật thành công.",
      status: "thành công",
      duration: 5000,
      isClosable: true,
    });
    navigate("/admin/districts");
  } catch (error) {
    console.error("Cập nhật lỗi:", error);
    toast({
      title: "Lỗi khi cập nhật Quận.",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};


  const handleCancel = () => {
    navigate("/admin/Districts");
  };

  return (
    <Box p={5} bg={bgColor} borderRadius="lg" boxShadow="md">
      <Text  fontSize="2xl" fontWeight="bold" mb={5}>sửa Quận/Huyện</Text>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4} isInvalid={errors.name}>
          <FormLabel>Tên Quận/Huyện</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên Quận/Huyện"
          />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>

        <FormControl id="province" mb={4} isInvalid={errors.province}>
          <FormLabel>Chọn Tỉnh/Thành</FormLabel>
          <Select
            placeholder="Chọn Tỉnh/Thành"
            value={province}
            onChange={(e) => setProvince(e.target.value)} // Set the Selected province
          >
            {provinces.map((city) => (
              <option key={city.id} value={city.id}>
                 
                {city.name}
              </option>
            ))}
          </Select>
          {errors.province && <FormErrorMessage>{errors.province}</FormErrorMessage>}
        </FormControl>

        <Button colorScheme="teal" type="submit" mr={4}>
         Sửa
        </Button>
        <Button
          bg="gray.400"
          _hover={{ bg: "gray.500" }}
          onClick={handleCancel}
        >
         Hủy
        </Button>
      </form>
    </Box>
  );
};

export default EditDistricts;