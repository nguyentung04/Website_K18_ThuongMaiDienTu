import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { addCities } from "../../../../service/api/cities"; // Ensure this function exists and works correctly

const AddCitiesPage = () => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên thương hiệu là bắt buộc.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const citiesData = { name };

    try {
      await addCities(citiesData); // Call your API to add the cities
      toast({
        title: "Tỉnh đã được thêm.",
        description: "Tỉnh mới đã được thêm thành công.",
        status: "success", // Changed to correct status value
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/cities"); // Ensure the correct path for navigation
    } catch (error) {
      console.error("Không thêm được Tỉnh:", error);
      toast({
        title: "Lỗi khi thêm Tỉnh.",
        description: "Không thêm được Tỉnh.",
        status: "error", // Changed to correct status value
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleCancel = () => {
    navigate("/admin/cities"); // Chuyển hướng về trang danh sách sản phẩm
  };
  return (
    <Box p={5} bg={bgColor} borderRadius="lg" boxShadow="md">
      <Text  fontSize="2xl" fontWeight="bold">Thêm tỉnh thành</Text>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4} isInvalid={errors.name}>
          <FormLabel>Tên tỉnh thành</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên tỉnh"
          />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>

        <Button colorScheme="teal" type="submit" mr={4}>
          Thêm
        </Button>  
         <Button colorScheme="gray" type="submit" onClick={handleCancel}>
        Hủy
        </Button>
      </form>
    </Box>
  );
};

export default AddCitiesPage;