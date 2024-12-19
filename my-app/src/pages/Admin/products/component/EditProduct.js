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
  Heading,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  fetchProductById,
  updateProduct,
} from "../../../../service/api/products";
import { fetchCategories } from "../../../../service/api/Category";
import axios from "axios";

const EditProduct = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [images, setImage] = useState("");
  const [stock, setStock] = useState("");
  const [gender, setGender] = useState("male");
  const [diameter, setDiameter] = useState("");
  const [wire_material, setWireMaterial] = useState("");
  const [categories, setCategories] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(id);
        console.log("Fetched product data:", data.category_id); // Log the fetched data
        if (data) {
          setProduct(data);
          setName(data.name || "");
          setCategory(data.category_id || ""); // Ensure category_id is used
          setPrice(data.price || "");
          setDescription(data.description || "");
          setShortDescription(data.short_description || "");
          setImage(data.images || "");
          setStock(data.stock || "");
          setGender(
            data.gender === "male" || data.gender === "female"
              ? data.gender
              : "male"
          ); // Nếu không có giá trị hợp lệ, mặc định là male
          setDiameter(data.diameter || "");
          setWireMaterial(data.wire_material || "");
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        if (categoriesData) {
          setCategories(categoriesData);

          console.log(categoriesData);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    getProduct();
    getCategories();
  }, [id]);

  console.log(category);
  // console.log(data);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Tên sản phẩm là bắt buộc.";
    if (!category) newErrors.category = "Loại sản phẩm là bắt buộc.";
    if (!price || isNaN(price) || parseFloat(price) <= 0)
      newErrors.price = "Giá là bắt buộc và phải là số lớn hơn 0.";
    if (!description) newErrors.description = "Mô tả là bắt buộc.";
    if (!shortDescription)
      newErrors.shortDescription = "Mô tả ngắn là bắt buộc.";
    if (!stock || isNaN(stock) || parseInt(stock) <= 0)
      newErrors.stock = "Số lượng là bắt buộc và phải là số nguyên dương.";
    if (!gender) newErrors.gender = "Giới tính là bắt buộc.";
    if (!diameter || isNaN(diameter) || parseInt(diameter) <= 0)
      newErrors.diameter =
        "Đường kính mặt đồng hồ là bắt buộc và phải là số nguyên dương.";
    if (!wire_material) newErrors.wire_material = "Chất liệu dây là bắt buộc.";
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

    let imageUrl = images;
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
        setImage(imageUrl);
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
      short_description: shortDescription,
      images: imageUrl,
      category_id: category,
      gender,
      diameter,
      wire_material,
    };

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
      <Heading mb={5}>Sửa sản phẩm</Heading>
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
          <Input value={price} onChange={(e) => setPrice(e.target.value)} />
          {errors.price && <FormErrorMessage>{errors.price}</FormErrorMessage>}
        </FormControl>
        <FormControl id="stock" mb={4} isInvalid={errors.stock}>
          <FormLabel>Số lượng</FormLabel>
          <Input value={stock} onChange={(e) => setStock(e.target.value)} />
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
        <FormControl id="gender" mb={4} isInvalid={errors.gender}>
          <FormLabel>Giới tính</FormLabel>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Chọn giới tính"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </Select>
          {errors.gender && (
            <FormErrorMessage>{errors.gender}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl id="diameter" mb={4} isInvalid={errors.diameter}>
          <FormLabel>Đường kính mặt đồng hồ</FormLabel>
          <Input
            value={diameter}
            onChange={(e) => setDiameter(e.target.value)}
            placeholder="Nhập đường kính mặt đồng hồ"
          />
          {errors.diameter && (
            <FormErrorMessage>{errors.diameter}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="wire_material" mb={4} isInvalid={errors.wire_material}>
          <FormLabel>Chất liệu dây</FormLabel>
          <Input
            value={wire_material}
            onChange={(e) => setWireMaterial(e.target.value)}
            placeholder="Nhập chất liệu dây"
          />
          {errors.wire_material && (
            <FormErrorMessage>{errors.wire_material}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="image" mb={4}>
          <FormLabel>Ảnh sản phẩm</FormLabel>
          <Input type="file" onChange={handleImageChange} />
          {images && (
            <img
              src={`http://localhost:3000/uploads/products/${images}`}
              alt="Current product"
              width="100"
            />
          )}
        </FormControl>

        <Button type="submit" colorScheme="blue">
          Cập nhật sản phẩm
        </Button>
      </form>
    </Box>
  );
};

export default EditProduct;
