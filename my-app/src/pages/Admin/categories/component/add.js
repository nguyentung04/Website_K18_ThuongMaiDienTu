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
import { addCategory } from "../../../../service/api/Category"; // Đảm bảo API này hoạt động đúng
import axios from "axios";

const AddCategoryPage = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null); // State để lưu hình ảnh
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên thương hiệu là bắt buộc.";
    if (!imageFile) newErrors.image = "Ảnh logo là bắt buộc."; // Thêm kiểm tra hình ảnh
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Tạo FormData để tải lên hình ảnh
    const formData = new FormData();
    formData.append("file", imageFile);

    let imageUrl = "";

    try {
      // Gửi yêu cầu tải lên hình ảnh
      const response = await axios.post(
        `http://localhost:3000/api/upload/categories`, // Đường dẫn API của bạn
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      imageUrl = response.data.filePath; // Lấy đường dẫn ảnh từ phản hồi API
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

    // Tạo object chứa dữ liệu danh mục cùng với đường dẫn ảnh
    const categoryData = { name, logo: imageUrl };

    try {
      await addCategory(categoryData); // Gọi API để thêm danh mục
      toast({
        title: "Thông báo",
        description: "Danh mục mới đã được thêm thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/category"); // Đảm bảo đường dẫn này đúng
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
    setImageFile(e.target.files[0]); // Cập nhật state khi người dùng chọn file
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

        <FormControl id="image" mb={4} isInvalid={errors.image}>
          <FormLabel>Logo danh mục</FormLabel>
          <Input type="file" onChange={handleImageChange} /> {/* Input để chọn ảnh */}
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
