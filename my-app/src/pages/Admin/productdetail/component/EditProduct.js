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
  Grid,
  GridItem,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import {
  fetchProductDetailById,
  updateProductDetail,
} from "../../../../service/api/product_detail";
import { fetchProducts } from "../../../../service/api/products"; // Fixed this to fetchProducts

const EditProduct = () => {
  const [product, setProduct] = useState(null); // Single product details
  const [productList, setProductList] = useState([]); // List of products for the dropdown
  const [formValues, setFormValues] = useState({
    machineType: "",
    identification: "",
    thickness: "",
    wireMaterial: "",
    antiWater: "",
    coler: "",
    gender: "",
    product_id: "",
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductDetailById(id);
        if (data) {
          setProduct(data); // Setting the product detail
          setFormValues({
            ...formValues,
            machineType: data.machineType || "",
            identification: data.identification || "",
            thickness: data.thickness || "",
            wireMaterial: data.wireMaterial || "",
            antiWater: data.antiWater || "",
            coler: data.coler || "",
            gender: data.gender || "",
            product_id: data.product_id || "",
          });
        }
      
      } catch (error) {
        toast({
          title: "Lỗi khi tải sản phẩm",
          description: "Không thể lấy thông tin chi tiết sản phẩm.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    const getCategories = async () => {
      try {
        const ProductData = await fetchProducts(); // Changed to fetchProducts for the list
        setProductList(ProductData || []);
      } catch (error) {
        toast({
          title: "Lỗi khi tải danh sách sản phẩm",
          description: "Không thể tải danh sách sản phẩm.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    getProduct();
    getCategories();
  }, [id, toast]);

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.machineType)
      newErrors.machineType = "Loại máy is required.";
    if (!formValues.identification)
      newErrors.identification = "SKU is required.";
    if (!formValues.thickness || formValues.thickness <= 0)
      newErrors.thickness = "Độ dầy must be a positive number.";
    if (!formValues.wireMaterial)
      newErrors.wireMaterial = "Chất liệu dây is required.";
    if (!formValues.antiWater || formValues.antiWater <= 0)
      newErrors.antiWater = "Độ kháng nước must be a positive number.";
    if (!formValues.coler) newErrors.coler = "Màu sắc is required.";
    if (!formValues.gender) newErrors.gender = "Giới tính is required.";
    if (!formValues.product_id) newErrors.product_id = "Product ID is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Lỗi xác thực",
        description: "Vui lòng điền chính xác tất cả các trường bắt buộc.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await updateProductDetail(id, formValues);
      toast({
        title: "Sản phẩm đã được cập nhật",
        description: "Chi tiết sản phẩm đã được cập nhật thành công.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/admin/productdetail");
    } catch (error) {
      toast({
        title: "Lỗi khi cập nhật sản phẩm",
        description: "Không thể cập nhật thông tin chi tiết sản phẩm.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormValues({ ...formValues, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    } 
     console.log(formValues);
  };

  const handleCancel = () => {
    navigate("/admin/productdetail");
  };

  return (
    <Box maxW={960}>
      <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
        <form onSubmit={handleSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {[
              {
                id: "machineType",
                label: "Loại máy",
                type: "text",
                placeholder: "Loại máy",
              },
              {
                id: "identification",
                label: "SKU",
                type: "text",
                placeholder: "Add a SKU",
              },
              {
                id: "thickness",
                label: "Độ dầy",
                type: "text",
                placeholder: "Độ dầy",
                unit: "mm",
              },
              {
                id: "wireMaterial",
                label: "Chất liệu dây",
                type: "text",
                placeholder: "Chất liệu dây",
              },
              {
                id: "antiWater",
                label: "Độ kháng nước",
                type: "text", // Ensure this remains as a number
                placeholder: "1", // Placeholder remains a number too
                unit: "ATM", // We add the ATM as a separate display
              },

              {
                id: "coler",
                label: "Màu sắc",
                type: "text",
                placeholder: "Màu sắc",
              },
            ].map(({ id, label, type, placeholder, unit }) => (
              <GridItem key={id} colSpan={1}>
                <FormControl id={id} mb={4} isInvalid={errors[id]}>
                  <FormLabel>{label}</FormLabel>
                  <InputGroup>
                    <Input
                      type={type}
                      value={formValues[id]}
                      onChange={(e) => handleInputChange(id, e.target.value)}
                      placeholder={placeholder}
                    />
                   
                  </InputGroup>
                  {errors[id] && (
                    <FormErrorMessage>{errors[id]}</FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
            ))}
           

            {/* Giới tính */}
            <GridItem colSpan={1}>
              <FormControl id="gender" mb={4} isInvalid={errors.gender}>
                <FormLabel>Giới tính</FormLabel>
                <Select
                  value={formValues.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  placeholder="Chọn giới tính"
                >
                  <option value="nam">Nam</option>
                  <option value="nữ">Nữ</option>
                </Select>
                {errors.gender && (
                  <FormErrorMessage>{errors.gender}</FormErrorMessage>
                )}
              </FormControl>
            </GridItem>
            {/* ID sản phẩm */}
            <GridItem colSpan={1}>
              <FormControl id="product_id" mb={4} isInvalid={errors.productId}>
                <FormLabel>ID sản phẩm</FormLabel>
                <Select
                  value={formValues.product_id} // Make sure it reflects the current productId
                  onChange={(e) =>
                    handleInputChange("product_id", e.target.value)
                  }
                  placeholder="Chọn ID sản phẩm"
                >
                  {productList.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </Select>
                {errors.product_id && (
                  <FormErrorMessage>{errors.product_id}</FormErrorMessage>
                )}
              </FormControl>
            </GridItem>
          </Grid>
          {/* Nút hành động */}
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button bg="gray.300" mr={4} onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="submit" bg="teal.400" color="white">
              Cập nhật
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default EditProduct;
