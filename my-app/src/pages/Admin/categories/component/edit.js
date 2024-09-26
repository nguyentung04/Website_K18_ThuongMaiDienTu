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
import {
  fetchCategoriesById,
  updateCategory,
} from "../../../../service/api/Category";

const EditCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
          setDescription(data.description || "");
        }
      } catch (error) {
        toast({
          title: "Error fetching category.",
          description: "Failed to fetch category details.",
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

    try {
      await updateCategory(id, categoryData);
      toast({
        title: "Category updated.",
        description: "Category details have been updated successfully.",
        status: "success",
        duration: 5000,
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