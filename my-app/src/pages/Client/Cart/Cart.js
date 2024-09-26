import React, { useState, useEffect, useRef } from "react";
import "./Cart.css";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Img,
  Input,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "../../../components/icon/icon";
import { NavLink } from "react-router-dom";

const BASE_URL = "http://localhost:3000"; // Cập nhật đúng URL của server

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [fadePrice, setFadePrice] = useState(null); // State to track fading item ID
  const cartContainerRef = useRef(null); // Ref to the cart container
  const username = localStorage.getItem("username");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    setLoading(false);
  }, []);
  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    // Lọc ra các sản phẩm không có id tương ứng để xóa
    const updatedCart = cart.filter((product) => product.id !== id);
    setCart(updatedCart); // Cập nhật lại trạng thái giỏ hàng
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu giỏ hàng mới vào localStorage
  };

  // Hàm kích hoạt hiệu ứng fade cho giá
  const triggerFade = (id) => {
    setFadePrice(id); // Thiết lập sản phẩm có hiệu ứng fade
    setTimeout(() => setFadePrice(null), 300); // Hiển thị giá sau 300ms
  };

  // Hàm tăng số lượng sản phẩm trong giỏ hàng
  const increaseQuantity = (id) => {
    setFadePrice(id); // Thiết lập sản phẩm có hiệu ứng fade
    setTimeout(() => {
      const updatedCart = cart.map(
        (item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item // Tăng số lượng sản phẩm
      );
      setCart(updatedCart); // Cập nhật lại giỏ hàng
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu giỏ hàng mới vào localStorage
      triggerFade(id); // Kích hoạt hiệu ứng fade sau khi cập nhật số lượng
    }, 300);
  };

  // Hàm giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQuantity = (id) => {
    setFadePrice(id); // Thiết lập sản phẩm có hiệu ứng fade
    setTimeout(() => {
      const updatedCart = cart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) } // Giảm số lượng nhưng không dưới 1
          : item
      );
      setCart(updatedCart); // Cập nhật lại giỏ hàng
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu giỏ hàng mới vào localStorage
      triggerFade(id); // Kích hoạt hiệu ứng fade sau khi cập nhật số lượng
    }, 300);
  };

  // Hàm xử lý thay đổi số lượng khi người dùng nhập tay
  const handleQuantityChange = (e, id) => {
    const value = e.target.value; // Lấy giá trị từ input
    if (!isNaN(value) && value > 0) {
      // Kiểm tra nếu giá trị là số và lớn hơn 0
      const updatedCart = cart.map(
        (item) =>
          item.id === id ? { ...item, quantity: parseInt(value, 10) } : item // Cập nhật số lượng
      );
      setCart(updatedCart); // Cập nhật lại giỏ hàng
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu giỏ hàng mới vào localStorage
    }
  };
  // Hàm tính tổng giá trị giỏ hàng
  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price =
        typeof item.price === "string"
          ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) // Chuyển chuỗi giá tiền thành số
          : parseFloat(item.price); // Nếu giá đã là số, thì giữ nguyên
      return total + item.quantity * (price || 0); // Cộng dồn giá trị từng sản phẩm vào tổng
    }, 0);
  };
  // Hàm tính tổng giá của một sản phẩm
  const getProductTotal = (item) => {
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) // Chuyển chuỗi giá thành số
        : parseFloat(item.price); // Nếu giá đã là số, giữ nguyên

    const discountPrice = item.discountPrice
      ? typeof item.discountPrice === "string"
        ? parseFloat(item.discountPrice.replace(/[^0-9.-]+/g, ""))
        : parseFloat(item.discountPrice)
      : null; // Kiểm tra nếu có giá giảm

    // Sử dụng giá giảm nếu có, nếu không thì dùng giá gốc
    const finalPrice = discountPrice || price;

    // Tính tổng giá sản phẩm
    return item.quantity * (finalPrice || 0);
  };

  // Hàm định dạng giá theo tiền tệ Việt Nam
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND", // Định dạng tiền tệ là VND
    }).format(price);
  };

  // Hàm xử lý khi người dùng nhấn nút thanh toán
  const handleCheckout = () => {
    if (!username) {
      // Kiểm tra nếu người dùng chưa đăng nhập
      alert("Vui lòng đăng nhập trước khi thanh toán."); // Hiển thị thông báo yêu cầu đăng nhập
      return;
    }
    setShowCheckoutForm(true); // Hiển thị form thanh toán
  };

  // Hiển thị thông báo đang tải nếu dữ liệu giỏ hàng chưa được load xong
  if (loading) {
    return <div>Đang tải giỏ hàng...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <span>Giỏ hàng của bạn đang trống!</span>
          <div className="card-button">
            <NavLink to={"/products"}>
              <Button>Mua thêm sản phẩm khác</Button>
            </NavLink>

            <NavLink to={"/"}>
              <Button>Về trang chủ</Button>
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart" ref={cartContainerRef}>
      <h3>Giỏ hàng</h3>

      <Box background="#e4cc972e" mb="40px" p="20px" borderRadius="6px">
        {cart.map((item, index) => (
          <Box key={item.id}>
            <button
              className="remove-button"
              onClick={() => removeFromCart(item.id)}
            >
              <DeleteIcon />
            </button>
            <Flex>
              <Img
                src={`${BASE_URL}/uploads/products/${item.image}`}
                alt={item.name}
                maxWidth="114px"
              />
              <Box
                width="78%"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "Center",
                }}
              >
                <Box
                  style={{
                    width: "300px",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical" /* Chuyển sang camelCase */,
                    WebkitLineClamp: 2 /* Chuyển sang camelCase */,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Heading as="h5" size="sm" color="#666" mb={2}>
                    {item.name}
                  </Heading>
                </Box>
                <Text
                  fontWeight="bold"
                  className={fadePrice === item.id ? "fade" : "show"}
               >
                <span> Giá: </span>
                 
                  {item.discountPrice
                    ? formatPrice(item.discountPrice)
                    : formatPrice(item.price)}
                </Text>
                <Flex align="center" gap={1}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => decreaseQuantity(item.id)}
                    width="33px"
                    height="35px"
                  >
                    -
                  </Button>
                  <Input
                    px={2}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(e, item.id)}
                    textAlign="center"
                    width="60px"
                    background="#ffffff"
                    height="35px"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </Button>
                </Flex>
                <Text
                  fontWeight="bold"
                  className={fadePrice === item.id ? "fade" : "show"}
                >
                <span> Tổng giá: </span> {formatPrice(getProductTotal(item))}
                </Text>
              </Box>
            </Flex>

            <Divider borderColor="#666" />
          </Box>
        ))}
        <Box display="flex" justifyContent="space-between">
          <Text my={3}>Vận chuyển:</Text>
          <Text my={3}>Miễn phí</Text>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Heading as="h5" size="sm">
            Tổng cộng:
          </Heading>
          <Heading
            fontWeight="bold"
            as="h5"
            size="sm"
            className={fadePrice ? "fade" : "show"}
          >
            {formatPrice(getTotal())}
          </Heading>
        </Box>
      </Box>

      <div className="cart-total">
        <button className="checkout-button" onClick={handleCheckout}>
          Thanh toán
        </button>
      </div>
      {showCheckoutForm && <CheckoutForm username={username} />}
    </div>
  );
};

export default Cart;
