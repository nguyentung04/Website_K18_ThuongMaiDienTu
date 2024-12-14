import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const [user, setUser] = useState(null);
  const BASE_URL = "http://localhost:3000"; // Cập nhật đúng URL của server

  // Đồng bộ user_id vào formData khi state `user` thay đổi
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        user_id: user.id,
      }));
    }
  }, [user]);

  // Lấy thông tin người dùng và giỏ hàng từ server
  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) throw new Error("Token không tồn tại. Vui lòng đăng nhập.");

        const decodedToken = jwtDecode(token); // Giải mã token
        const { id: user_id, name, email } = decodedToken;

        setUser({ id: user_id, name, email }); // Lưu thông tin người dùng

        setFormData((prev) => ({
          ...prev,
          name: name || "",
          email: email || "",
        }));

        // Lấy giỏ hàng từ server theo user_id
        const response = await axios.get(
          `${BASE_URL}/api/cart_userId/${user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Dữ liệu giỏ hàng từ API:", response.data);

        setCart(response.data || []); // Lưu dữ liệu giỏ hàng
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng và giỏ hàng:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu. Vui lòng thử lại.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login"); // Chuyển hướng đến trang đăng nhập
      }
    };

    fetchUserAndCart(); // Gọi hàm lấy dữ liệu khi component được render
  }, []);

  // Xử lý thanh toán MoMo từ URL callback
  useEffect(() => {
    const processMoMoCallback = async () => {
      if (location.search && user) {
        const urlParams = new URLSearchParams(location.search);

        const orderId = urlParams.get("orderId");
        const amount = urlParams.get("amount");
        const resultCode = urlParams.get("resultCode");

        if (orderId && amount && resultCode) {
          try {
            // Lấy formData từ localStorage
            const savedFormData =
              JSON.parse(localStorage.getItem("checkoutForm")) || {};

            // Gọi API để lấy thông tin giỏ hàng
            const token = localStorage.getItem("token"); // Đảm bảo token được truyền
            const response = await axios.get(
              `${BASE_URL}/api/cart_userId/${user.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const cartData = response.data || [];
            setCart(cartData);
            const savedOrderItems = response.data?.items?.cartData || [];
            if (!Array.isArray(savedOrderItems)) {
              console.warn("Dữ liệu giỏ hàng không hợp lệ:", savedOrderItems);
            }
            // Đảm bảo giá trị mặc định

            // Cập nhật dữ liệu vào state
            setFormData((prev) => ({
              ...prev,
              ...savedFormData,
            }));

            // Gọi addOrderMomo
            addOrderMomo(
              orderId,
              amount,
              resultCode,
              savedFormData,
              savedOrderItems
            );
          } catch (error) {
            console.error("Lỗi khi lấy thông tin giỏ hàng:", error.message);
            // Xử lý fallback nếu cần
          }
        }
      }
    };

    processMoMoCallback();
  }, [location, user]);

  const clearCart = async (user_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }

      await axios.delete(`${BASE_URL}/api/cart_user_id/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart([]); // Xóa giỏ hàng trong state
      localStorage.removeItem("cart"); // Xóa giỏ hàng trong localStorage
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

  const addOrderMomo = async (
    orderId,
    amount,
    resultCode,
    formDataOverride,
    savedOrderItems
  ) => {
    // Xóa giỏ hàng sau khi đặt hàng thành công
    await clearCart();
    try {
      const updatedFormData = formDataOverride || formData;

      if (Number(resultCode) === 0) {
        const orderItems = cart.map((item) => ({
          product_id: item.product_id,
          total_quantity: item.total_quantity,
          product_price: parseFloat(item.product_price),
          total: parseFloat(item.product_price) * item.total_quantity,
        }));

        const payload = {
          ...updatedFormData,
          orderCode: orderId,
          Provinces: updatedFormData.city,
          Districts: updatedFormData.province,
          shipping_address: updatedFormData.address,
          order_detail: orderItems,
          user_id: user.id,
          total_amount: parseFloat(amount),
        };

        console.log("Payload gửi lên server:", payload);

        const response = await axios.post(`${BASE_URL}/api/orders`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("Đơn hàng MoMo đã được thêm:", response.data);
      } else {
        console.warn("Giao dịch không thành công, resultCode:", resultCode);
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng MoMo:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const totalAmount = cart.reduce(
        (total, item) => total + item.total_quantity * item.product_price,
        0
      );

      
      // Tạo mã đơn hàng ngẫu nhiên
      const orderCode = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 5)
        .toUpperCase()}`;

      // Lưu formData vào localStorage
      const formDataToSave = {
        ...formData,
        orderCode,
        totalAmount,
        shipping_address: formData.address,
        orderItems: cart.map((item) => ({
          product_id: item.product_id,
          total_quantity: item.total_quantity,
          product_price: parseFloat(item.product_price),
          total: parseFloat(item.product_price) * item.total_quantity,
        })),
      };
      localStorage.setItem("checkoutForm", JSON.stringify(formDataToSave)); // Lưu formData
      if (formData.paymentMethod === "momo") {
        // Xử lý thanh toán bằng MoMo
        const momoResponse = await axios.post(
          `${BASE_URL}/payment`,
          {
            amount: totalAmount,
            orderInfo: `${orderCode}`,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (momoResponse.data?.payUrl) {
          // Chuyển hướng tới trang thanh toán MoMo
          window.location.href = momoResponse.data.payUrl;
          return;
        } else {
          throw new Error("Không thể tạo giao dịch thanh toán bằng MoMo.");
        }
      }

      // Xử lý đơn hàng COD
      const response = await axios.post(
        `${BASE_URL}/api/orders`,
        {
          ...formData,
          orderCode,
          Provinces: formData.city,
          Districts: formData.province,
          shipping_address: formData.address,
          orderItems: cart.map((item) => ({
            product_id: item.product_id,
            total_quantity: item.total_quantity,
            product_price: parseFloat(item.product_price),
            total: parseFloat(item.product_price) * item.total_quantity,
          })),
          user_id: user?.id,
          total_amount: totalAmount,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Xóa giỏ hàng sau khi đặt hàng thành công
      await clearCart();

      toast({
        title: "Thành công!",
        description: response.data.message || "Đơn hàng đã được xử lý.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/");
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

  // Hàm xóa giỏ hàng

  return (
    <div className="checkout-form">
      <h2>Thông tin người mua hàng</h2>
      <Box flex={7}>
        <form onSubmit={handleSubmit}>
          <FormControl mb={3} isInvalid={errors.name}>
            <FormLabel htmlFor="name">Tên khách hàng</FormLabel>
            <Input
            typeof="text"
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
              type=""
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
              <option value="momo"> Chuyển khoản MoMo</option>
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
