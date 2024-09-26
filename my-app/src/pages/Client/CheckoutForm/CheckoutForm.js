import React, { useState } from "react";
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

  const [errors, setErrors] = useState({});
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const toast = useToast(); // Chakra-UI toast

  const provinces = [
    {
      name: "Hà Nội",
      cities: ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Tây Hồ"],
    },
    {
      name: "TP Hồ Chí Minh",
      cities: ["Quận 1", "Quận 2", "Quận 3"],
    },
    {
      name: "Đà Nẵng",
      cities: ["Quận Hải Châu", "Quận Thanh Khê", "Quận Ngũ Hành Sơn"],
    },
  ];

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData({
      ...formData,
      province: selectedProvince,
      city: "", // Reset city when province changes
    });
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
    if (!formData.name) newErrors.name = "Tên khách hàng là bắt buộc";
    if (!formData.email) newErrors.email = "Địa chỉ email là bắt buộc";
    if (!formData.phone) newErrors.phone = "Số điện thoại là bắt buộc";
    if (!formData.province) newErrors.province = "Tỉnh là bắt buộc";
    if (!formData.city) newErrors.city = "Thành phố là bắt buộc";
    if (!formData.address) newErrors.address = "Địa chỉ nhận hàng là bắt buộc";
    if (!formData.paymentMethod) newErrors.paymentMethod = "Chọn phương thức thanh toán";

    setErrors(newErrors);
    return !Object.values(newErrors).length; // Return true if no errors
  };
// Hàm xử lý khi người dùng nhấn nút gửi đơn hàng
const handleSubmit = async (e) => {
  e.preventDefault(); // Ngăn không cho trang reload khi submit form

  // Kiểm tra tính hợp lệ của biểu mẫu
  if (!validateForm()) {
    return; // Nếu biểu mẫu không hợp lệ, dừng xử lý
  }

  // Lấy giỏ hàng từ localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Kiểm tra nếu giỏ hàng trống
  if (cart.length === 0) {
    alert("Giỏ hàng trống. Không thể đặt hàng."); // Thông báo nếu giỏ hàng trống
    return;
  }

  // Tạo danh sách các mặt hàng trong đơn hàng
  const orderItems = cart.map((item) => ({
    product_id: item.id, // ID sản phẩm
    quantity: item.quantity, // Số lượng sản phẩm
    price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")), // Chuyển đổi giá sản phẩm thành dạng số
    total: parseFloat(item.price.replace(/[^0-9.-]+/g, "")) * item.quantity, // Tính tổng giá trị sản phẩm theo số lượng
  }));

  try {
    // Gửi yêu cầu POST tới API để đặt hàng
    const response = await fetch("http://localhost:3000/api/orders", {
      method: "POST", // Phương thức gửi yêu cầu
      headers: {
        "Content-Type": "application/json", // Định dạng dữ liệu gửi là JSON
      },
      body: JSON.stringify({
        ...formData, // Thông tin người dùng từ form
        order_detail: orderItems, // Chi tiết đơn hàng
      }),
    });

    // Chuyển đổi kết quả phản hồi thành JSON
    const data = await response.json();

    // Kiểm tra nếu đơn hàng được đặt thành công
    if (data.message === "Đặt hàng thành công!") {
      localStorage.removeItem("cart"); // Xóa giỏ hàng khỏi localStorage sau khi đặt hàng thành công
      toast({
        title: "Đặt hàng thành công", // Tiêu đề thông báo
        description: "Đơn hàng của bạn đã được gửi.", // Nội dung thông báo
        status: "success", // Trạng thái thành công
        duration: 5000, // Thời gian hiển thị thông báo
        isClosable: true, // Cho phép đóng thông báo
      });

      // Reset lại dữ liệu biểu mẫu
      setFormData({
        name: "",
        email: "",
        phone: "",
        province: "",
        city: "",
        address: "",
        note: "",
        paymentMethod: "COD", // Thiết lập phương thức thanh toán mặc định là "COD"
      });
    } else {
      throw new Error("Có lỗi xảy ra. Vui lòng thử lại."); // Nếu có lỗi, ném ra ngoại lệ
    }
  } catch (error) {
    console.error("Lỗi khi gửi đơn hàng:", error); // Ghi log lỗi ra console
    toast({
      title: "Lỗi", // Tiêu đề thông báo lỗi
      description: error.message, // Nội dung thông báo lỗi
      status: "error", // Trạng thái lỗi
      duration: 5000, // Thời gian hiển thị thông báo
      isClosable: true, // Cho phép đóng thông báo
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
              placeholder="Nhập tên khách hàng"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
          </FormControl>

          <Flex mb={3} gap={4}>
            <FormControl flex={1} isInvalid={errors.email}>
              <FormLabel htmlFor="email">Địa chỉ email</FormLabel>
              <Input
                className="custom-input"
                id="email"
                placeholder="Địa chỉ email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl flex={1} isInvalid={errors.phone}>
              <FormLabel htmlFor="phone">Số điện thoại</FormLabel>
              <Input
                className="custom-input"
                type="number"
                id="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>

          <Flex mb={3} gap={4}>
            <FormControl flex={1} isInvalid={errors.province}>
              <FormLabel htmlFor="province">Tỉnh</FormLabel>
              <Select
                className="custom-input"
                id="province"
                value={formData.province}
                onChange={handleChange}
              >
                <option value="">Chọn Tỉnh</option>
                {/* Map provinces here */}
              </Select>
              {errors.province && (
                <FormErrorMessage>{errors.province}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl flex={1} isInvalid={errors.city}>
              <FormLabel htmlFor="city">Thành phố</FormLabel>
              <Select
                className="custom-input"
                id="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!formData.province}
              >
                <option value="">Chọn Thành phố</option>
              </Select>
              {errors.city && (
                <FormErrorMessage>{errors.city}</FormErrorMessage>
              )}
            </FormControl>
          </Flex>

          <FormControl mb={3} isInvalid={errors.address}>
            <FormLabel htmlFor="address">Địa chỉ nhận hàng</FormLabel>
            <Input
              className="custom-input"
              id="address"
              placeholder="Nhập địa chỉ nhận hàng"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <FormErrorMessage>{errors.address}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mb={3}>
            <FormLabel htmlFor="note">Ghi chú</FormLabel>
            <Textarea
              className="custom-input"
              id="note"
              rows={3}
              placeholder="Nhập ghi chú"
              value={formData.note}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={3} isInvalid={errors.paymentMethod}>
            <FormLabel htmlFor="paymentMethod">
              Phương thức thanh toán
            </FormLabel>
            <Select
              className="custom-input"
              id="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="COD">Thanh toán khi giao hàng (COD)</option>
              <option value="bankTransfer">Chuyển khoản</option>
            </Select>
            {errors.paymentMethod && (
              <FormErrorMessage>{errors.paymentMethod}</FormErrorMessage>
            )}
          </FormControl>
          <Button type="submit" className="button_order">
            Đặt hàng
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default CheckoutForm;
