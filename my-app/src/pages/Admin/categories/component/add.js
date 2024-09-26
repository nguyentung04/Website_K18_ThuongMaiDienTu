import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../../../../service/api/Category"; // Ensure this function exists and works correctly

const AddCategoryPage = () => {
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

    const categoryData = { name };

    try {
      await addCategory(categoryData); // Call your API to add the category
      toast({
        title: "Danh mục đã được thêm.",
        description: "Danh mục mới đã được thêm thành công.",
        status: "success", // Changed to correct status value
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/category"); // Ensure the correct path for navigation
    } catch (error) {
      console.error("Không thêm được danh mục:", error);
      toast({
        title: "Lỗi khi thêm danh mục.",
        description: "Không thêm được danh mục.",
        status: "error", // Changed to correct status value
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} bg={bgColor} borderRadius="lg" boxShadow="md">
      <Heading mb={5}>Thêm danh mục</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4} isInvalid={errors.name}>
          <FormLabel>Tên danh mục</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên danh mục"
          />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>

        <Button colorScheme="teal" type="submit">
          Thêm
        </Button>
      </form>
    </Box>
  );
};

export default AddCategoryPage;