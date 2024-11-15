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
  const [stock, setStock] = useState("");
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
          setImage(data.image || "");
          setStock(data.stock || "");
        }
      } catch (error) {
        toast({
          title: "Lỗi khi tải sản phẩm.",
          description: "Không thể lấy thông tin chi tiết sản phẩm.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to fetch product:", error);
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
          title: "Lỗi khi tải danh mục.",
          description: "Không thể lấy danh mục sản phẩm.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to fetch categories:", error);
      }
    };

    getProduct();
    getCategories();
  }, [id, toast]);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên sản phẩm là bắt buộc.";
    if (!category) newErrors.category = "Loại sản phẩm là bắt buộc.";
    if (!price || isNaN(price) || parseFloat(price) <= 0)
      newErrors.price = "Giá là bắt buộc và phải là số lớn hơn 0.";
    if (!description) newErrors.description = "Mô tả là bắt buộc.";
    if (!stock || isNaN(stock) || parseInt(stock) <= 0)
      newErrors.stock = "Số lượng là bắt buộc và phải là số nguyên dương.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    if (imageFile) {
      formData.append("file", imageFile);
    }

    let imageUrl = image;
    if (imageFile) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/upload/products",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        imageUrl = response.data.filePath;
        setImage(imageUrl); // Cập nhật hiển thị ảnh mới trên giao diện
      } catch (error) {
        toast({
          title: "Lỗi tải hình ảnh lên",
          description: "Không tải được hình ảnh.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }
    

    const productData = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      images: imageUrl,
      category_id: category,
    };

    console.log(productData);
    
    try {
      await updateProduct(id, productData);
      toast({
        title: "Sản phẩm đã được cập nhật.",
        description: "Cập nhật sản phẩm thành công.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/products");
    } catch (error) {
      console.error("Update product error:", error);
      toast({
        title: "Lỗi cập nhật sản phẩm.",
        description: "Không thể cập nhật sản phẩm. Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  if (!product) return <div>Loading...</div>;

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
            placeholder="Chọn loại sản phẩm"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
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
            min="0.01"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && <FormErrorMessage>{errors.price}</FormErrorMessage>}
        </FormControl>
        <FormControl id="stock" mb={4} isInvalid={errors.stock}>
          <FormLabel>Số lượng</FormLabel>
          <Input
            type="number"
            min="1"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          {errors.stock && <FormErrorMessage>{errors.stock}</FormErrorMessage>}
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
        <FormControl id="image" mb={4}>
          <FormLabel>Ảnh sản phẩm</FormLabel>
          <Input type="file" onChange={handleImageChange} />
          {image && <img src={image} alt="Current product" width="100" />}
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Cập nhật sản phẩm
        </Button>
      </form>
    </Box>
  );
};

export default EditProduct;