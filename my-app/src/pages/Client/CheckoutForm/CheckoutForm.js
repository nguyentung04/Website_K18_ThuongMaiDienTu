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
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { fetchProvinces, fetchDistricts } from "../../../service/api/city";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    province: "",
    address: "",
    note: "",
    paymentMethod: "COD",
  });

  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch locations once the component mounts
    const getLocations = async () => {
      try {
        const data = await fetchDistricts();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    getLocations();
  }, []);

  useEffect(() => {
    // Retrieve userId from localStorage once when the component mounts
    const userData = localStorage.getItem("userData");
  
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData && parsedUserData.id) {
          setUserId(parsedUserData.id); // Set the userId if found
        } else {
          console.error("No user id found in localStorage.");
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    } else {
      console.log("No user data found in localStorage.");
    }
  }, []);

  useEffect(() => {
    // Update the list of districts based on the selected city
    if (cities) {
      const province = locations.find((loc) => loc.name === cities);
      setDistricts(province ? province.districts : []);
    } else {
      setDistricts([]);
    }
  }, [cities, locations]);

  const handleProvinceChange = async (e) => {
    const selectedProvince = e.target.value;
    setFormData({
      ...formData,
      province: selectedProvince,
    });

    setLoadingDistricts(true);
    try {
      const districtsData = await fetchDistricts();
      setDistricts(districtsData);
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setFormData({
      ...formData,
      city: selectedCity,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;

    if (!formData.name) newErrors.name = "Tên khách hàng là bắt buộc";
    if (!formData.email || !emailRegex.test(formData.email))
      newErrors.email = "Địa chỉ email không hợp lệ";
    if (!formData.phone || !phoneRegex.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (!formData.address) newErrors.address = "Địa chỉ nhận hàng là bắt buộc";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Chọn phương thức thanh toán";

    setErrors(newErrors);
    return !Object.values(newErrors).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        alert("Giỏ hàng trống. Không thể đặt hàng.");
        return;
      }

      const orderItems = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: parseFloat(item.price),
        total: parseFloat(item.price) * item.quantity,
      }));

      const orderData = {
        ...formData,
        Provinces: formData.city,
        Districts: formData.province,
        order_detail: orderItems,
        user_id: userId, // Ensure userId is included in the order data
      };

      console.log(orderData); // Check the order data

      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
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
        navigate("/");
        setFormData({
          name: "",
          email: "",
          phone: "",
          city: "",
          districts: "",
          address: "",
          note: "",
          paymentMethod: "COD",
        });
      } else {
        throw new Error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Lỗi",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
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
          <Box display="flex" flexDirection="row" mb={3} gap={2}>
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
          </Box>

          <Box display="flex" flexDirection="row" mb={3} gap={2}>
            {loadingLocations ? (
              <Spinner />
            ) : (
              <Flex>
                <FormControl mb={3} isInvalid={errors.province}>
                  <FormLabel htmlFor="province">Tỉnh/Thành phố</FormLabel>
                  <Select
                    className="custom-input"
                    id="province"
                    name="province"
                    value={formData.province}
                    placeholder="Chọn Tỉnh/Thành phố"
                    onChange={handleProvinceChange}
                    mb={4}
                  >
                    {locations.map((location, index) => (
                      <option key={index} value={location.name}>
                        {location.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl mb={3} isInvalid={errors.city}>
                  <FormLabel htmlFor="city">Quận/Huyện</FormLabel>
                  <Select
                    className="custom-input"
                    id="city"
                    name="city"
                    value={formData.city}
                    placeholder="Chọn Quận/Huyện"
                    isDisabled={!formData.province}
                    onChange={handleCityChange}
                  >
                    {districts.map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Flex>
            )}
          </Box>

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

          <Button className="w-100" type="submit" colorScheme="teal" isLoading={isSubmitting}>
            Đặt hàng
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default CheckoutForm;
