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
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategoriesById, updateCategory } from "../../../../service/api/Category";
import axios from "axios";

const EditCategory = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(""); // Lưu đường dẫn logo hiện tại
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên thương hiệu là bắt buộc.";
    return newErrors;
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const data = await fetchCategoriesById(id);
        if (data) {
          setName(data.name || "");
          setCurrentLogo(data.logo || ""); // Lưu đường dẫn logo hiện tại
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể cập nhật!!!",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to fetch category:", error);
      }
    };
    getCategory();
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const categoryData = { name };

    // Handle image upload if an image file is provided
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const response = await axios.post(
          `http://localhost:3000/api/upload/categories`, // URL upload logo
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        categoryData.logo = response.data.filePath; // Set logo path to category data
      } catch (error) {
        toast({
          title: "Image Upload Error",
          description: "Failed to upload logo.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    } else {
      // Nếu không có hình ảnh mới, giữ nguyên logo cũ
      categoryData.logo = currentLogo; // Sử dụng logo hiện tại
    }

    try {
      console.log("Updating category with data:", categoryData); // Log data sent to API
      await updateCategory(id, categoryData);
      toast({
        title: "Thông báo",
        description: "Cập nhật thành công!!!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/Category");
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error updating category.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleCancel = () => {
    navigate("/admin/Category");
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
      <Heading mb={5}>Sửa thông tin thương hiệu</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4} isInvalid={errors.name}>
          <FormLabel>Tên thương hiệu</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>
        <FormControl id="logo" mb={4}>
          <FormLabel>Logo (Không bắt buộc)</FormLabel>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </FormControl>
        <Button colorScheme="teal" mr="10px" type="submit">
          Đồng ý
        </Button>
        <Button colorScheme="gray" onClick={handleCancel}>
          Hủy
        </Button>
      </form>
    </Box>
  );
};

export default EditCategory;
