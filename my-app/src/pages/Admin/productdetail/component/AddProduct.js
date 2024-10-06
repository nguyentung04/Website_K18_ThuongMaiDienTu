import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, FormControl, FormLabel, Input, Button, Select, Grid, GridItem,
  useToast, FormErrorMessage, InputGroup, InputRightAddon,
} from "@chakra-ui/react";
import { addProductDetail, fetchProduct_not_in_the_table } from "../../../../service/api/product_detail";

const AddProduct = () => {
  // Khai báo các state để lưu dữ liệu
  const [machineType, setMachineType] = useState("");
  const [identification, setIdentification] = useState("");
  const [thickness, setThickness] = useState("");
  const [wireMaterial, setWireMaterial] = useState("");
  const [antiWater, setAntiWater] = useState("");
  const [gender, setGender] = useState("");
  const [coler, setColor] = useState("");
  const [productId, setProductId] = useState("");
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchProduct_not_in_the_table();
        setCategories(categoriesData || []);
      } catch (error) {
        toast({
          title: "Lỗi khi tải sản phẩm.",
          status: "error", duration: 5000, isClosable: true,
        });
      }
    };
    getCategories();
  }, [toast]);

  // Hàm kiểm tra lỗi nhập liệu
  const validateForm = () => {
    const newErrors = {};
    if (!machineType) newErrors.machineType = "Loại máy là bắt buộc.";
    if (!identification) newErrors.identification = "SKU là bắt buộc.";
    if (!thickness || parseFloat(thickness) <= 0) newErrors.thickness = "Độ dày phải là số dương.";
    if (!wireMaterial || !isNaN(parseFloat(wireMaterial))) newErrors.wireMaterial = "Không được nhập số.";
    if (!antiWater || parseFloat(antiWater) < 1) newErrors.antiWater = "Chống nước phải ≥ 1.";
    if (!gender) newErrors.gender = "Giới tính là bắt buộc.";
    if (!coler || !isNaN(parseFloat(coler))) newErrors.coler = "Không được nhập số.";
    if (!productId) newErrors.productId = "ID sản phẩm là bắt buộc.";
    return newErrors;
  };

  // Cập nhật giá trị form
  const handleInputChange = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    switch (field) {
      case "machineType": setMachineType(value); break;
      case "identification": setIdentification(value); break;
      case "thickness": setThickness(value); break;
      case "wireMaterial": setWireMaterial(value); break;
      case "antiWater": setAntiWater(value); break;
      case "gender": setGender(value); break;
      case "coler": setColor(value); break;
      case "productId": setProductId(value); break;
      default: break;
    }
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    try {
      await addProductDetail({
        machineType, identification, thickness: `${thickness}mm`,
        wireMaterial, antiWater: `${antiWater}ATM`, gender, coler, product_id: productId,
      });
      toast({ title: "Đã thêm sản phẩm.", status: "success", duration: 5000, isClosable: true });
      navigate("/admin/productdetail");
    } catch (error) {
      toast({ title: "Lỗi khi thêm sản phẩm.", status: "error", duration: 5000, isClosable: true });
    }
  };

  return (
    <Box maxW={960}>
      <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
        <form onSubmit={handleSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {[
              { id: "machineType", label: "Loại máy", value: machineType, onChange: setMachineType, type: "text" },
              { id: "identification", label: "SKU", value: identification, onChange: setIdentification, type: "text" },
              { id: "thickness", label: "Độ dầy", value: thickness, onChange: setThickness, type: "number", unit: "mm" },
              { id: "wireMaterial", label: "Chất liệu dây", value: wireMaterial, onChange: setWireMaterial, type: "text" },
              { id: "antiWater", label: "Độ kháng nước", value: antiWater, onChange: setAntiWater, type: "number", unit: "ATM" },
              { id: "coler", label: "Màu sắc", value: coler, onChange: setColor, type: "text" },
            ].map(({ id, label, value, onChange, type, unit }) => (
              <GridItem key={id} colSpan={1}>
                <FormControl id={id} mb={4} isInvalid={errors[id]}>
                  <FormLabel>{label}</FormLabel>
                  <InputGroup>
                    <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
                    {unit && <InputRightAddon>{unit}</InputRightAddon>}
                  </InputGroup>
                  {errors[id] && <FormErrorMessage>{errors[id]}</FormErrorMessage>}
                </FormControl>
              </GridItem>
            ))}
            {/* Giới tính */}
            <GridItem colSpan={1}>
              <FormControl id="gender" mb={4} isInvalid={errors.gender}>
                <FormLabel>Giới tính</FormLabel>
                <Select value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Chọn giới tính">
                  <option value="nam">Nam</option>
                  <option value="nữ">Nữ</option>
                </Select>
                {errors.gender && <FormErrorMessage>{errors.gender}</FormErrorMessage>}
              </FormControl>
            </GridItem>
            {/* ID sản phẩm */}
            <GridItem colSpan={1}>
              <FormControl id="productId" mb={4} isInvalid={errors.productId}>
                <FormLabel>ID sản phẩm</FormLabel>
                <Select value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="Chọn ID sản phẩm">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
                {errors.productId && <FormErrorMessage>{errors.productId}</FormErrorMessage>}
              </FormControl>
            </GridItem>
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Button bg="gray.300" mr={4} onClick={() => navigate("/admin/productdetail")}>Hủy</Button>
            <Button type="submit" bg="teal.400" color="white">Thêm</Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default AddProduct;
