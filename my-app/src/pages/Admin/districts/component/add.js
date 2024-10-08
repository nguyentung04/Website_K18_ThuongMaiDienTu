import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  Select,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { addDistricts } from "../../../../service/api/districts"; // Ensure this function exists and works correctly
import { fetchCities } from "../../../../service/api/cities"; // Add the function to fetch cities

const AddDistrictsPage = () => {
  const [name, setName] = useState("");
  const [province, setProvince] = useState(""); // State to hold the selected province ID
  const [provinces, setProvinces] = useState([]); // State to hold the list of provinces
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");

  // Fetch provinces (cities) on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await fetchCities();
        setProvinces(data); // Assuming data contains the list of cities (provinces)
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    loadProvinces();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên quận huyện là bắt buộc.";
    if (!province) newErrors.province = "Tỉnh thành là bắt buộc.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Correctly assigning city_Id to the selected province value (ID)
    const DistrictsData = { name, city_id: province };

    try {
      console.log(DistrictsData);
      
      await addDistricts(DistrictsData); // Call your API to add the district
      toast({
        title: "Quận/Huyện đã được thêm.",
        description: "Quận/Huyện mới đã được thêm thành công.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/districts"); // Ensure the correct path for navigation
    } catch (error) {
      console.error("Không thêm được Quận/Huyện:", error);
      toast({
        title: "Lỗi khi thêm Quận/Huyện.",
        description: "Không thêm được Quận/Huyện.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/districts"); // Navigate back to the districts list page
  };

  return (
    <Box p={5} bg={bgColor} borderRadius="lg" boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={5}>Thêm Quận/Huyện</Text>
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
            onChange={(e) => setProvince(e.target.value)} // Set the selected province ID
          >
            {provinces.map((city) => (
              <option key={city.id} value={city.id}> {/* Use city.id */}
          
                {city.name}
              </option>
            ))}
          </Select>
          {errors.province && <FormErrorMessage>{errors.province}</FormErrorMessage>}
        </FormControl>

        <Button colorScheme="teal" type="submit" mr={4}>
          Thêm
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

export default AddDistrictsPage;
