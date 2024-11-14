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
  Textarea,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategoriesById, updateCategory } from "../../../../service/api/Category";
import axios from "axios";

const EditCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [imageFile, setImageFile] = useState(null);
  const [currentLogo, setCurrentLogo] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên thương hiệu là bắt buộc.";
    if (!description) newErrors.description = "Mô tả là bắt buộc."; // Validate description
    return newErrors;
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const data = await fetchCategoriesById(id);
        if (data) {
          setName(data.name || "");
          setDescription(data.description || ""); // Set description
          setCurrentLogo(data.logo || "");
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

    const categoryData = { name, description };

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const response = await axios.post(
          `http://localhost:3000/api/upload/categories`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        categoryData.logo = response.data.filePath;
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
      categoryData.logo = currentLogo;
    }

    try {
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

        <FormControl id="description" mb={4} isInvalid={errors.description}>
          <FormLabel>Mô tả</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả cho danh mục"
          />
          {errors.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
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
