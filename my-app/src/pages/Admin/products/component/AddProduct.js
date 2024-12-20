import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  useToast,
  Heading,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { fetchCategories } from "../../../../service/api/Category";
import { addProduct } from "../../../../service/api/products";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [gender, setGender] = useState(""); 
  const [diameter, setDiameter] = useState("");
  const [wire_material, setWire_material] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        if (categoriesData) {
          setCategories(categoriesData);
        }
      } catch (error) {
        toast({
          title: "Error fetching categories.",
          description: "Failed to fetch categories.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to fetch categories:", error);
      }
    };

    getCategories();
  }, [toast]);

  const validateForm = () => {
    const newErrors = {};

    if (!name) newErrors.name = "Tên sản phẩm là bắt buộc.";
    if (!category) newErrors.category = "Loại sản phẩm là bắt buộc.";
    if (!price || isNaN(price) || parseFloat(price) <= 0)
      newErrors.price = "Giá là bắt buộc và phải là số lớn hơn 0.";
    if (!stock || isNaN(stock) || parseInt(stock) <= 0)
      newErrors.stock = "Số lượng là bắt buộc và phải là số nguyên dương.";
    if (!diameter || isNaN(diameter) || parseInt(diameter) <= 0)
      newErrors.diameter = "Đường kính mặt đồng hồ là bắt buộc và phải là số nguyên dương.";
    if (!wire_material) newErrors.wire_material = "Chất liệu dây là bắt buộc.";
    if (!description) newErrors.description = "Mô tả là bắt buộc.";
    if (!shortDescription) newErrors.shortDescription = "Mô tả ngắn là bắt buộc.";
    if (!imageFile) newErrors.image = "Ảnh sản phẩm là bắt buộc.";
    if (!gender) newErrors.gender = "Giới tính là bắt buộc."; // Thêm kiểm tra giới tính

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

    const formData = new FormData();
    formData.append("file", imageFile);

    let imageUrl = "";

    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload/products",
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
        title: "Lỗi tải hình ảnh lên",
        description: "Không tải được hình ảnh.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const productData = {
      name,
      price,
      stock: parseInt(stock),
      description,
      short_description: shortDescription,
      images: [imageUrl],
      category_id: category,
      gender,
      diameter,
      wire_material,
    };

    try {
      await addProduct(productData);
      toast({
        title: "Sản phẩm đã được thêm.",
        description: "Sản phẩm đã được thêm thành công.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/products");
    } catch (error) {
      console.error("Add product error:", error);
      toast({
        title: "Lỗi thêm sản phẩm.",
        description: "Không thể thêm sản phẩm. Vui lòng thử lại.",
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
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
      <Heading mb={5}>Thêm sản phẩm</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4} isInvalid={errors.name}>
          <FormLabel>Tên sản phẩm</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên sản phẩm"
          />
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
          {errors.category && <FormErrorMessage>{errors.category}</FormErrorMessage>}
        </FormControl>

        <FormControl id="price" mb={4} isInvalid={errors.price}>
          <FormLabel>Giá</FormLabel>
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Nhập giá sản phẩm"
          />
          {errors.price && <FormErrorMessage>{errors.price}</FormErrorMessage>}
        </FormControl>

        <FormControl id="stock" mb={4} isInvalid={errors.stock}>
          <FormLabel>Số lượng</FormLabel>
          <Input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Nhập số lượng"
          />
          {errors.stock && <FormErrorMessage>{errors.stock}</FormErrorMessage>}
        </FormControl>
        <FormControl id="gender" mb={4} isInvalid={errors.gender}>
          <FormLabel>Giới tính</FormLabel>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Chọn giới tính"
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </Select>
          {errors.gender && <FormErrorMessage>{errors.gender}</FormErrorMessage>}
        </FormControl>
        <FormControl id="diameter" mb={4} isInvalid={errors.diameter}>
          <FormLabel>Đường kính mặt đồng hồ</FormLabel>
          <Input
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            placeholder="Nhập đường kính mặt đồng hồ"
          />
          {errors.diameter && <FormErrorMessage>{errors.diameter}</FormErrorMessage>}
        </FormControl>
        <FormControl id="wire_material" mb={4} isInvalid={errors.wire_material}>
          <FormLabel>Chất liệu dây</FormLabel>
          <Input
            value={wire_material}
            onChange={(e) => setWire_material(e.target.value)}
            placeholder="Nhập chất liệu dây"
          />
          {errors.wire_material && <FormErrorMessage>{errors.wire_material}</FormErrorMessage>}
        </FormControl>
        <FormControl id="description" mb={4} isInvalid={errors.description}>
          <FormLabel>Mô tả</FormLabel>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả sản phẩm"
          />
          {errors.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
        </FormControl>

        <FormControl
          id="shortDescription"
          mb={4}
          isInvalid={errors.shortDescription}
        >
          <FormLabel>Mô tả ngắn</FormLabel>
          <Input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
          {errors.shortDescription && (
            <FormErrorMessage>{errors.shortDescription}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl id="image" mb={4} isInvalid={errors.image}>
          <FormLabel>Ảnh sản phẩm</FormLabel>
          <Input type="file" onChange={handleImageChange} />
          {errors.image && <FormErrorMessage>{errors.image}</FormErrorMessage>}
        </FormControl>

        <Button type="submit" colorScheme="blue">
          Thêm sản phẩm
        </Button>
      </form>
    </Box>
  );
};

export default AddProduct;
