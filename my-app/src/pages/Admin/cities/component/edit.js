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
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCitiesById,
  updateCities,
} from "../../../../service/api/cities";

const EditCities = () => {
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
    const getcities = async () => {
      try {
        const data = await fetchCitiesById(id);
        if (data) {
          setName(data.name || "");
          setDescription(data.description || "");
        }
      } catch (error) {
        toast({
          title: "Có lỗi khi tìm kiếm thành phố.",
          description: "Không thể lấy thông tin chi tiết về thành phố.",
          status: "lỗi",
          duration: 5000,
          isClosable: true,
        });
        console.error("Không thể lấy được thành phố:", error);
      }
    };
    getcities();
  }, [id, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const citiesData = { name };

    try {
      await updateCities(id, citiesData);
      toast({
        title: "thành phố được cập nhật.",
        description: "chi tiết thành phố đã được cập nhật thành công.",
        status: "thành công",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/cities");
    } catch (error) {
      console.error("Cập nhật lỗi:", error);
      toast({
        title: "Có lỗi khi cập nhật thành phố.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/cities");
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
        <Text  fontSize="2xl" fontWeight="bold">Sửa thông tin Tỉnh thành</Text>
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

export default EditCities;