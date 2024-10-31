import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  useToast,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { addCategory } from "../../../../service/api/Category";
import axios from "axios";

const AddCategoryPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên thương hiệu là bắt buộc.";
    if (!description) newErrors.description = "Mô tả là bắt buộc.";
    if (!imageFile) newErrors.image = "Ảnh logo là bắt buộc.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    let imageUrl = "";
    try {
      const response = await axios.post(
        `http://localhost:3000/api/upload/categories`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      imageUrl = response.data.filePath;
    } catch (error) {
      toast({
        title: "Lỗi tải lên hình ảnh",
        description: "Không tải được hình ảnh.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const categoryData = { name, description, logo: imageUrl };

    try {
      await addCategory(categoryData);
      toast({
        title: "Thông báo",
        description: "Danh mục mới đã được thêm thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/category");
    } catch (error) {
      console.error("Không thêm được danh mục:", error);
      toast({
        title: "Lỗi khi thêm danh mục.",
        description: "Không thêm được danh mục.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
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

        <FormControl id="description" mb={4} isInvalid={errors.description}>
          <FormLabel>Mô tả</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả danh mục"
          />
          {errors.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
        </FormControl>

        <FormControl id="image" mb={4} isInvalid={errors.image}>
          <FormLabel>Logo danh mục</FormLabel>
          <Input type="file" onChange={handleImageChange} />
          {errors.image && <FormErrorMessage>{errors.image}</FormErrorMessage>}
        </FormControl>

        <Button colorScheme="teal" type="submit">
          Thêm
        </Button>
      </form>
    </Box>
  );
};

export default AddCategoryPage;
