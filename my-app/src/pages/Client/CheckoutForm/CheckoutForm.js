import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutForm.css";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { fetchCities, fetchDistrictsByCity } from '../../../service/api/city';

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    note: "",
    paymentMethod: "COD",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const citiesData = await fetchCities();
        setCities(citiesData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error);
      }
    };

    fetchCityData();
  }, []);

  const handleProvinceChange = async (e) => {
    const selectedProvince = e.target.value;
    // Cập nhật dữ liệu của form, đồng thời reset thành phố khi thay đổi tỉnh
    setFormData({
      ...formData,
      province: selectedProvince,
      city: "",
    });

    try {
      const districtsData = await fetchDistrictsByCity(selectedProvince);
      setDistricts(districtsData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận/huyện:", error);
    }
  };

  // Hàm xử lý khi người dùng thay đổi thành phố
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    // Cập nhật thành phố trong dữ liệu của form
    setFormData({
      ...formData,
      city: selectedCity,
    });
  };

  // Hàm xử lý các thay đổi khác của form (tên, email, địa chỉ, v.v.)
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Cập nhật trường tương ứng trong form dựa vào thuộc tính 'name' của input
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm kiểm tra tính hợp lệ của form trước khi submit
  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra từng trường dữ liệu, nếu trống thì thêm thông báo lỗi tương ứng
    if (!formData.name) newErrors.name = "Tên khách hàng là bắt buộc";
    if (!formData.email) newErrors.email = "Địa chỉ email là bắt buộc";
    if (!formData.phone) newErrors.phone = "Số điện thoại là bắt buộc";
    if (!formData.province) newErrors.province = "Tỉnh là bắt buộc";
    if (!formData.city) newErrors.city = "Thành phố là bắt buộc";
    if (!formData.address) newErrors.address = "Địa chỉ nhận hàng là bắt buộc";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Chọn phương thức thanh toán";

    setErrors(newErrors);
    return !Object.values(newErrors).length; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; // Nếu biểu mẫu không hợp lệ, dừng xử lý
    }
  
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Giỏ hàng trống. Không thể đặt hàng.");
      return;
    }
  
    const orderItems = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price: parseFloat(String(item.price).replace(/[^0-9.-]+/g, "")),
      total: parseFloat(String(item.price).replace(/[^0-9.-]+/g, "")) * item.quantity,
    }));
  
    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id_cities: formData.province, 
          id_districts: formData.city,
          order_detail: orderItems,
        }),
      });
  
      const data = await response.json();
  
      if (data.message === "Đặt hàng thành công!") {
        localStorage.removeItem("cart");
        toast({
          title: "Đặt hàng thành công",
          description: "Đơn hàng của bạn đã được gửi.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
  
        navigate("/products");
  
        setFormData({
          name: "",
          email: "",
          phone: "",
          province: "",
          city: "",
          address: "",
          note: "",
          paymentMethod: "COD",
        });
      } else {
        throw new Error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      toast({
        title: "Lỗi",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  

  return (
    <div className="checkout-form">
      <h2>Thông tin người mua hàng</h2>
      <Box flex={7}>
        <form onSubmit={handleSubmit}>
          <FormControl mb={3} isInvalid={errors.name}>
            <FormLabel htmlFor="name">Tên khách hàng</FormLabel>
            <Input
              className="custom-input"
              id="name"
              name="name"
              placeholder="Nhập tên khách hàng"
              value={formData.name}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl mb={3} isInvalid={errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              className="custom-input"
              id="email"
              name="email"
              placeholder="Nhập địa chỉ email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl mb={3} isInvalid={errors.phone}>
            <FormLabel htmlFor="phone">Số điện thoại</FormLabel>
            <Input
              className="custom-input"
              id="phone"
              name="phone"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </FormControl>

          <FormControl mb={3} isInvalid={errors.province}>
            <FormLabel htmlFor="province">Tỉnh/Thành phố</FormLabel>
            <Select
              className="custom-input"
              id="province"
              name="province"
              placeholder="Chọn tỉnh/thành phố"
              value={formData.province}
              onChange={handleProvinceChange}
            >
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.province}</FormErrorMessage>
          </FormControl>

          <FormControl mb={3} isInvalid={errors.city}>
            <FormLabel htmlFor="city">Quận/Huyện</FormLabel>
            <Select
              className="custom-input"
              id="city"
              name="city"
              placeholder="Chọn quận/huyện"
              value={formData.city}
              onChange={handleCityChange}
            >
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.city}</FormErrorMessage>
          </FormControl>

          <FormControl mb={3} isInvalid={errors.address}>
            <FormLabel htmlFor="address">Địa chỉ cụ thể</FormLabel>
            <Textarea
              className="custom-input"
              id="address"
              name="address"
              placeholder="Nhập địa chỉ nhận hàng"
              value={formData.address}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.address}</FormErrorMessage>
          </FormControl>

          <FormControl mb={3} isInvalid={errors.paymentMethod}>
            <FormLabel htmlFor="paymentMethod">Phương thức thanh toán</FormLabel>
            <Select
              className="custom-input"
              id="paymentMethod"
              name="paymentMethod"
              placeholder="Chọn phương thức thanh toán"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="COD">Thanh toán khi nhận hàng</option>
              <option value="Bank Transfer">Chuyển khoản ngân hàng</option>
            </Select>
            <FormErrorMessage>{errors.paymentMethod}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="teal">
            Đặt hàng
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default CheckoutForm;
