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
import CartProvider from "../../../components/Client/componentss/Cart_Context";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
const BASE_URL = "http://localhost:3000"; // Cập nhật đúng URL của server

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [fadePrice, setFadePrice] = useState(null); // State to track fading item userId
  const cartContainerRef = useRef(null); // Ref to the cart container
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchUserIdFromToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token)
          throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        if (!userId) throw new Error("Không tìm thấy userId trong token.");

        localStorage.setItem("userId", userId);
        return userId;
      } catch (error) {
        console.error("Lỗi khi lấy userId từ token:", error);
        setError("Vui lòng đăng nhập lại.");
        setLoading(false);
        return null;
      }
    };

    fetchUserIdFromToken();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User ID không tồn tại.");

        const response = await axios.get(
          `${BASE_URL}/api/cart_userId/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Dữ liệu trả về từ API:", response.data); // Kiểm tra dữ liệu từ API
        const cartData = response.data || [];
        setCart(cartData);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cartData)); // Save cart to localStorage
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Không thể tải giỏ hàng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const saveCartToLocal = (updatedCart) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
    }
  };
  // Thêm userId vào dependency array

  // Lấy user_id từ localStorage
  // ====================================================================================
  // Hàm xóa sản phẩm khỏi giỏ hàng

  const removeFromCart = async (product_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID không tồn tại.");

      // Gọi API để xóa sản phẩm khỏi giỏ hàng
      await axios.delete(`${BASE_URL}/api/cart/${userId}/${product_id}`);

      // Cập nhật state sau khi xóa
      setCart((prevCart) =>
        prevCart.filter((item) => item.product_id !== product_id)
      );

      // Kiểm tra xem toast có được gọi không
      console.log("Gọi toast thành công!");

      // Hiển thị thông báo thành công
      toast({
        title: "Thành công!",
        description: "Sản phẩm đã được xóa khỏi giỏ hàng.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error removing item:", error);

      // Kiểm tra lỗi
      console.log("Gọi toast lỗi!");

      // Hiển thị thông báo lỗi
      toast({
        title: "Lỗi",
        description:
          error.message || "Không thể xóa sản phẩm. Vui lòng thử lại sau.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // ====================================================================================================
  // Hàm kích hoạt hiệu ứng fade cho giá
  const triggerFade = (id) => {
    setFadePrice(id); // Thiết lập sản phẩm có hiệu ứng fade
    setTimeout(() => setFadePrice(null), 500); // Hiển thị giá sau 300ms
  };

  // =========================================================================================================
  const updateCartInAPI = async (updatedCart) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID không tồn tại.");

      // Gửi yêu cầu cập nhật server
      await axios.put(
        `${BASE_URL}/api/cart/${userId}`,
        {
          cart_id: 233,
          cart_items: updatedCart.map((item) => ({
            product_id: item.product_id,
            total_quantity: item.total_quantity,
            product_price: item.product_price,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Không thể cập nhật giỏ hàng. Vui lòng thử lại sau.");
    }
  };
  const [isUpdating, setIsUpdating] = useState(false);
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Hàm tăng số lương sản phẩm  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const increaseQuantity = async (product_id) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      // Kiểm tra sản phẩm tồn tại trong giỏ hàng
      const productExists = cart.some((item) => item.product_id === product_id);
      if (!productExists) {
        console.error(`Không tìm thấy sản phẩm với ID: ${product_id}`);
        return;
      }

      // Cập nhật giỏ hàng
      const updatedCart = cart.map((item) =>
        item.product_id === product_id
          ? { ...item, total_quantity: item.total_quantity + 1 }
          : item
      );

      console.log(`Đã tăng số lượng cho sản phẩm ID: ${product_id}`); // Kiểm tra xem đúng ID
      setCart(updatedCart);
      saveCartToLocal(updatedCart);
      await updateCartInAPI(updatedCart);
      triggerFade(product_id); // Trigger the fade effect when quantity changes
      triggerFade(product_id);
    } finally {
      setIsUpdating(false);
    }
  };

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Hàm giảm số lương sản phẩm  =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const decreaseQuantity = async (product_id) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      // Kiểm tra sản phẩm tồn tại trong giỏ hàng
      const productExists = cart.some((item) => item.product_id === product_id);
      if (!productExists) {
        console.error(`Không tìm thấy sản phẩm với ID: ${product_id}`);
        return;
      }

      // Kiểm tra số lượng sản phẩm, đảm bảo không giảm xuống dưới 1
      const updatedCart = cart.map((item) =>
        item.product_id === product_id
          ? {
              ...item,
              total_quantity:
                item.total_quantity > 1 ? item.total_quantity - 1 : 1, // Giới hạn số lượng không giảm dưới 1
            }
          : item
      );

      console.log(`Đã giảm số lượng cho sản phẩm ID: ${product_id}`); // Kiểm tra xem đúng ID
      setCart(updatedCart);
      saveCartToLocal(updatedCart);
      await updateCartInAPI(updatedCart);
      triggerFade(product_id); // Trigger the fade effect when quantity changes
    } finally {
      setIsUpdating(false);
    }
  };

  // Khi nhấn thanh toán hoặc sau khi thay đổi nhiều lần
  const handleCheckout = async () => {
    if (!username) {
      alert("Vui lòng đăng nhập trước khi thanh toán."); // Hiển thị thông báo yêu cầu đăng nhập
      return;
    }
    await updateCartInAPI(cart); // Gửi giỏ hàng lên API trước khi thanh toán
    setShowCheckoutForm(true); // Hiển thị form thanh toán
  };

  // ==================================================================================================
  // Hàm tính tổng giá trị giỏ hàng
  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price =
        typeof item.price === "string"
          ? parseFloat(item.pr_price.replace(/[^0-9.-]+/g, "")) // Chuyển chuỗi giá tiền thành số
          : parseFloat(item.product_price); // Nếu giá đã là số, thì giữ nguyên
      return total + item.total_quantity * (price || 0); // Cộng dồn giá trị từng sản phẩm vào tổng
    }, 0);
  };
  // Hàm tính tổng giá của một sản phẩm
  const getProductTotal = (item) => {
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) // Chuyển chuỗi giá thành số
        : parseFloat(item.product_price); // Nếu giá đã là số, giữ nguyên

    const discountPrice = item.discountPrice
      ? typeof item.discountPrice === "string"
        ? parseFloat(item.discountPrice.replace(/[^0-9.-]+/g, ""))
        : parseFloat(item.discountPrice)
      : null; // Kiểm tra nếu có giá giảm

    // Sử dụng giá giảm nếu có, nếu không thì dùng giá gốc
    const finalPrice = discountPrice || price;

    // Tính tổng giá sản phẩm
    return item.total_quantity * (finalPrice || 0);
  };

  // Hàm định dạng giá theo tiền tệ Việt Nam
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND", // Định dạng tiền tệ là VND
    }).format(price);
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
      <h3>GIỎ HÀNG CỦA BẠN</h3>
      <ToastContainer />
      <Box background="fff" mb="40px" p="20px" borderRadius="6px">
        {cart.map((item, index) => (
          <Box>
            {" "}
            <CartProvider>
              <Box
                className="d-flex justify-content-between "
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "Center",
                }}
              >
                <Flex className="d-flex align-items-center">
                  <Img
                    style={{ mixBlendMode: "multiply" }}
                    className="me-4"
                    src={`http://localhost:3000/uploads/products/${item.images}`}
                    alt={item.product_name}
                    maxWidth="114px"
                  />

                  <Heading
                    style={{
                      width: "300px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical" /* Chuyển sang camelCase */,
                      WebkitLineClamp: 2 /* Chuyển sang camelCase */,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    as="h5"
                    size="sm"
                    color="#666"
                    mb={2}
                  >
                    {item.product_name}
                  </Heading>
                </Flex>
                <Flex className="d-flex align-items-center" fontWeight="bold">
                  <span>
                    {" "}
                    Giá:{" "}
                    {item.discountPrice
                      ? formatPrice(item.discountPrice)
                      : formatPrice(item.product_price)}{" "}
                  </span>{" "}
                </Flex>
                <Flex align="center" gap={1}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => decreaseQuantity(item.product_id)}
                    width="33px"
                    height="35px"
                  >
                    -
                  </Button>
                  <Input
                    px={2}
                    value={item.total_quantity}
                    textAlign="center"
                    width="60px"
                    background="#ffffff"
                    height="35px"
                    onChange={triggerFade}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => increaseQuantity(item.product_id)}
                  >
                    +
                  </Button>
                </Flex>
                <Flex fontWeight="bold" className="d-flex align-items-center">
                  <span> Tổng giá:</span>
                  <Box
                    onChange={triggerFade}
                    className={fadePrice === item.product_id ? "fade" : "show"}
                    style={{ marginLeft: "5px" }}
                  >
                    {" "}
                    {formatPrice(getProductTotal(item))}{" "}
                  </Box>
                </Flex>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  <DeleteIcon />
                  <deleteIcon />
                </button>
              </Box>
            </CartProvider>
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
            onChange={triggerFade}
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
