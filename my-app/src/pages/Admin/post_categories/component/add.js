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
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { addPost_categories } from "../../../../service/api/post_categories"; // Ensure this API function works

const AddCategoryPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // Using a string for description
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

    const post_categoriesData = { name, description };
    console.log(post_categoriesData);

    try {
      await addPost_categories(post_categoriesData); // Call the API to add category
      toast({
        title: "Thông báo",
        description: "Danh mục mới đã được thêm thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/post_categories");
    } catch (error) {
      console.error("Không thêm được Tỉnh:", error);
      toast({
        title: "Lỗi khi thêm danh mục.",
        description: "Không thêm được danh mục.",
        status: "error",
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

        <FormControl id="description" mb={4}>
          <FormLabel>Nội dung danh mục</FormLabel>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập nội dung danh mục"
            type="text"
          />
        </FormControl>

        <Button colorScheme="teal" type="submit">
          Thêm
        </Button>
      </form>
    </Box>
  );
};

export default AddCategoryPage;