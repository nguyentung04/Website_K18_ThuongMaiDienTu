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
  const toast = useToast(); // Chakra-UI toast

  // Hàm xử lý khi người dùng thay đổi tỉnh/thành phố
  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    // Cập nhật dữ liệu của form, đồng thời reset thành phố khi thay đổi tỉnh
    setFormData({
      ...formData,
      province: selectedProvince,
      city: "", // Reset thành phố khi tỉnh thay đổi
    });
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
    // Trả về true nếu không có lỗi nào, ngược lại là false
    return !Object.values(newErrors).length;
  };

  // Hàm xử lý khi người dùng submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Nếu form không hợp lệ, dừng việc submit
    if (!validateForm()) return;

    // Lấy thông tin giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra nếu giỏ hàng rỗng, hiển thị thông báo
    if (cart.length === 0) {
      alert("Giỏ hàng trống. Không thể đặt hàng.");
      return;
    }

    // Tạo danh sách sản phẩm trong đơn hàng dựa vào giỏ hàng
    const orderItems = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      // Xử lý giá để chuyển đổi thành số và tính tổng tiền cho mỗi sản phẩm
      price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")),
      total: parseFloat(item.price.replace(/[^0-9.-]+/g, "")) * item.quantity,
    }));

    try {
      // Gửi yêu cầu tạo đơn hàng lên server qua API
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData, // Gửi dữ liệu form kèm theo
          order_detail: orderItems, // Gửi chi tiết đơn hàng
        }),
      });

      // Xử lý kết quả trả về từ server
      const data = await response.json();

      // Nếu đơn hàng thành công
      if (data.message === "Đặt hàng thành công!") {
        localStorage.removeItem("cart"); // Xóa giỏ hàng sau khi đặt hàng thành công
        toast({
          title: "Đặt hàng thành công",
          description: "Đơn hàng của bạn đã được gửi.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Reset lại form sau khi đặt hàng
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
      // Nếu có lỗi trong quá trình đặt hàng, hiển thị thông báo lỗi
      toast({
        title: "Lỗi",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const provinces = [
    {
      name: "Hà Nội",
      cities: [
        "Quận Ba Đình",
        "Quận Hoàn Kiếm",
        "Quận Đống Đa",
        "Quận Cầu Giấy",
      ],
    },
    {
      name: "Hồ Chí Minh",
      cities: ["Quận 1", "Quận 3", "Quận 5", "Quận Bình Thạnh"],
    },
    {
      name: "Đà Nẵng",
      cities: ["Hải Châu", "Cẩm Lệ", "Sơn Trà", "Ngũ Hành Sơn"],
    },
    // Add more provinces and cities here
  ];

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
            {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
          </FormControl>

          <Flex mb={3} gap={4}>
            <FormControl flex={1} isInvalid={errors.email}>
              <FormLabel htmlFor="email">Địa chỉ email</FormLabel>
              <Input
                className="custom-input"
                id="email"
                name="email"
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
                name="phone"
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
                name="province"
                value={formData.province}
                onChange={handleProvinceChange}
              >
                <option value="">Chọn Tỉnh</option>
                {provinces.map((province) => (
                  <option key={province.name} value={province.name}>
                    {province.name}
                  </option>
                ))}
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
                name="city"
                value={formData.city}
                onChange={handleCityChange}
                disabled={!formData.province}
              >
                <option value="">Chọn Thành phố</option>
                {formData.province &&
                  provinces
                    .find((province) => province.name === formData.province)
                    .cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
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
              name="address"
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
              name="note"
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
              name="paymentMethod"
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
