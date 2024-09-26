
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  fetchProductById,
  updateProduct,
} from "../../../../service/api/products";
import { fetchCategories } from "../../../../service/api/Category";
import axios from "axios";

const EditProduct = () => {
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(id);
        if (data) {
          setProduct(data);
          setName(data.name || "");
          setCategory(data.category_id || "");
          setPrice(data.price || "");
          setDescription(data.description || "");
          setStatus(data.status || "");
          setImage(data.image || "");
        }
      } catch (error) {
        toast({
          title: "Lỗi khi tải sản phẩm.",
          description: "Không thể lấy thông tin chi tiết sản phẩm.",
          status: "Lỗi",
          duration: 5000,
          isClosable: true,
        });
        console.error("Không thể tải sản phẩm:", error);
      }
    };

    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        if (categoriesData) {
          setCategories(categoriesData);
        }
      } catch (error) {
        toast({
          title: "Có lỗi khi tìm danh mục.",
          description: "Không tìm được danh mục.",
          status: "lỗi",
          duration: 5000,
          isClosable: true,
        });
        console.error("Không thể tìm được danh mục:", error);
      }
    };

    getProduct();
    getCategories();
  }, [id, toast]);

  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = "Tên sản phẩm là bắt buộc.";
    if (!category) newErrors.category = "Loại sản phẩm là bắt buộc.";
    if (!price || isNaN(price))
      newErrors.price = "Giá là bắt buộc và phải là số.";
    if (!image) newErrors.image = "Ảnh sản phẩm là bắt buộc.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
    }

    let imageUrl = image;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const response = await axios.post(
          `http://localhost:3000/api/upload/products`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = response.data.filePath;
      } catch (error) {
        toast({
          title: "Image Upload Error",
          description: "Failed to upload image.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    const productData = {
      name,
      price,
      description,
      image: imageUrl,
      status,
      category_id: category,
    };

    try {
      await updateProduct(id, productData);
      toast({
        title: "Product updated.",
        description: "Product details have been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/products");
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error updating product.",
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

  if (!product) return <p>Loading...</p>;

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4} isInvalid={errors.name}>
          <FormLabel>Tên sản phẩm</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>
        <FormControl id="category" mb={4} isInvalid={errors.category}>
          <FormLabel>Loại sản phẩm</FormLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Chọn loại sản phẩm</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.category && (
            <FormErrorMessage>{errors.category}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="price" mb={4} isInvalid={errors.price}>
          <FormLabel>Giá</FormLabel>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && <FormErrorMessage>{errors.price}</FormErrorMessage>}
        </FormControl>

        <FormControl id="description" mb={4} isInvalid={errors.description}>
          <FormLabel>Mô tả</FormLabel>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="status" mb={4} isInvalid={errors.status}>
          <FormLabel>Trạng thái</FormLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Chọn trạng thái</option>
            <option value="bán chạy">Bán chạy</option>
            <option value="nổi bật">Nổi bật</option>
            <option value="khuyến mãi">Khuyến mãi</option>
          </Select>
          {errors.status && (
            <FormErrorMessage>{errors.status}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl id="image" mb={4} isInvalid={errors.image}>
          <FormLabel>Ảnh sản phẩm</FormLabel>
          <Input type="file" onChange={handleImageChange} />
          {errors.image && <FormErrorMessage>{errors.image}</FormErrorMessage>}
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Đồng ý
        </Button>
      </form>
    </Box>
  );
};

export default EditProduct;
