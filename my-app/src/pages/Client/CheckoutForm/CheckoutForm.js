import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutForm.css";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode"; // Import thư viện
import axios from "axios";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    province: "",
    address: "",
    note: "",
    paymentMethod: "COD",
  });
  const [cart, setCart] = useState([]);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [user, setUser] = useState(null);
  const BASE_URL = "http://localhost:3000"; // Cập nhật đúng URL của server

  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token không tồn tại. Vui lòng đăng nhập.");

        // Giải mã token để lấy user_id và thông tin người dùng
        const decodedToken = jwtDecode(token);
        const { id: user_id, name, email } = decodedToken;

        // Cập nhật thông tin người dùng vào formData
        setUser({ id: user_id, name, email });
        setFormData((prev) => ({
          ...prev,
          name: name || "",
          email: email || "",
        }));

        // Gọi API để lấy giỏ hàng theo user_id
        const response = await axios.get(`${BASE_URL}/api/cart/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cartData = response.data || [];
        setCart(cartData); // Lưu giỏ hàng vào state
        localStorage.setItem("cart", JSON.stringify(cartData)); // Đồng bộ giỏ hàng vào localStorage
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng và giỏ hàng:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu. Vui lòng thử lại.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login"); // Điều hướng về trang đăng nhập nếu lỗi xác thực
      }
    };

    fetchUserAndCart();
  }, []);

  const clearCart = async (user_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }
  
      // Gửi yêu cầu DELETE với user_id trong URL
      await axios.delete(`${BASE_URL}/api/cart_user_id/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast({
        title: "Thành công!",
        description: "Giỏ hàng đã được xóa.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa giỏ hàng. Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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

    if (!formData.name.trim()) newErrors.name = "Tên khách hàng là bắt buộc";
    if (!formData.email.trim() || !emailRegex.test(formData.email))
      newErrors.email = "Địa chỉ email không hợp lệ";
    if (!formData.address.trim())
      newErrors.address = "Địa chỉ nhận hàng là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    try {
      if (cart.length === 0) {
        toast({
          title: "Giỏ hàng trống.",
          description: "Không thể đặt hàng khi giỏ hàng trống.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
  
      const totalAmount = cart.reduce(
        (total, item) => total + item.total_quantity * item.total_price,
        0
      );
  
      const orderItems = cart.map((item) => ({
        product_id: item.product_id,
        total_quantity: item.total_quantity,
        total_price: parseFloat(item.total_price),
        total: parseFloat(item.total_price) * item.total_quantity,
      }));
  
      const orderData = {
        ...formData,
        Provinces: formData.city,
        Districts: formData.province,
        order_detail: orderItems,
        user_id: user?.id,
        total_amount: totalAmount,
      };
  
      console.log("Order Data:", orderData);
  
      const response = await axios.post(`${BASE_URL}/api/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.data.message === "Đặt hàng thành công!") {
        // Xóa giỏ hàng sau khi đặt hàng thành công
        await clearCart(user.id);
        localStorage.removeItem("cart");
        setCart([]); // Cập nhật lại giỏ hàng trong state
  
        toast({
          title: "Thành công!",
          description: "Đơn hàng đã được đặt.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
  
        navigate("/"); // Chuyển về trang chính
      } else {
        throw new Error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra. Vui lòng thử lại.",
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

          <Box display="flex" flexDirection="row" mb={3} gap={2}>
            <FormControl mb={3} isInvalid={errors.province}>
              <FormLabel htmlFor="province">Tỉnh/Thành phố</FormLabel>
              <Input
                className="custom-input"
                id="province"
                name="province"
                placeholder="Nhập Tỉnh/Thành phố"
                value={formData.province}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.province}</FormErrorMessage>
            </FormControl>

            <FormControl mb={3} isInvalid={errors.city}>
              <FormLabel htmlFor="city">Quận/Huyện</FormLabel>
              <Input
                className="custom-input"
                id="city"
                name="city"
                placeholder="Nhập Quận/Huyện"
                value={formData.city}
                onChange={handleChange}
              />
              <FormErrorMessage>{errors.city}</FormErrorMessage>
            </FormControl>
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
            <FormLabel htmlFor="paymentMethod">
              Phương thức thanh toán
            </FormLabel>
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

          <Button
            className="w-100"
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
          >
            Đặt hàng
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default CheckoutForm;