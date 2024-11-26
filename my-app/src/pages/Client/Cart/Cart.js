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
import { NavLink, useParams } from "react-router-dom";
import CartProvider from "../../../components/Client/componentss/Cart_Context";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
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
        if (!token) throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
  
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
  
        const response = await axios.get(`${BASE_URL}/api/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
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
  // const removeFromCart = (id) => {
  //   // Lọc ra các sản phẩm không có id tương ứng để xóa
  //   const updatedCart = cart.filter((product) => product.id !== id);
  //   setCart(updatedCart); // Cập nhật lại trạng thái giỏ hàng
  //   localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu giỏ hàng mới vào localStorage
  // };

const removeFromCart = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${BASE_URL}/api/cart/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const updatedCart = cart.filter((product) => product.id !== id);
    setCart(updatedCart);
    saveCartToLocal(updatedCart); // Save updated cart
  } catch (error) {
    console.error("Error removing item:", error);
    alert("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
  }
};
  

  // ====================================================================================================
  // Hàm kích hoạt hiệu ứng fade cho giá
  // const triggerFade = (id) => {
  //   setFadePrice(id); // Thiết lập sản phẩm có hiệu ứng fade
  //   setTimeout(() => setFadePrice(null), 300); // Hiển thị giá sau 300ms
  // };

  const triggerFade = (id) => {
    if (fadePrice !== id) {
      // Kiểm tra nếu hiệu ứng chưa kích hoạt cho id này
      setFadePrice(id); // Thiết lập sản phẩm có hiệu ứng fade
      setTimeout(() => {
        if (fadePrice === id) {
          setFadePrice(null); // Chỉ tắt hiệu ứng nếu id vẫn khớp
        }
      }, 300); // Hiển thị giá sau 300ms
    }
  };

  // =========================================================================================================
  // Hàm tăng số lượng sản phẩm trong giỏ hàng
  const increaseQuantity = async (id, product_id, cart_id) => {
    try {
      const updatedCart = cart.map((item) =>
        item.product_id === product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      saveCartToLocal(updatedCart); // Save updated cart
  
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/cart/${id}`,
        { cart_id, cart_items: updatedCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error increasing quantity:", error);
      alert("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
    }
  };
  

  // Hàm giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQuantity = async (cart_id, product_id) => {
    try {
      // Cập nhật số lượng trên giao diện
      const updatedCart = cart.map((item) =>
        item.product_id === product_id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      );
      setCart(updatedCart);
  
      // Lấy sản phẩm được cập nhật
      const updatedItem = updatedCart.find((item) => item.product_id === product_id);
      const cart_items = updatedCart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));
  
      // Gửi yêu cầu lên server
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
  
      await axios.put(
        `${BASE_URL}/api/cart/update`,
        {
          cart_id,
          cart_items,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Lỗi khi giảm số lượng sản phẩm:", error);
      alert("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
    }
  };
  

  // ========================================================================================================
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

  // const handleQuantityChange = (e, id) => {
  //   const value = parseInt(e.target.value, 10);
  //   if (isNaN(value) || value <= 0) return; // Prevent invalid input
  //   const updatedCart = cart.map((item) =>
  //     item.id === id ? { ...item, quantity: value } : item
  //   );
  //   setCart(updatedCart);
  //   localStorage.setItem("cart", JSON.stringify(updatedCart));
  // };

  // ==================================================================================================
  // Hàm tính tổng giá trị giỏ hàng
  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price =
        typeof item.price === "string"
          ? parseFloat(item.pr_price.replace(/[^0-9.-]+/g, "")) // Chuyển chuỗi giá tiền thành số
          : parseFloat(item.total_price); // Nếu giá đã là số, thì giữ nguyên
      return total + item.total_quantity * (price || 0); // Cộng dồn giá trị từng sản phẩm vào tổng
    }, 0);
  };
  // Hàm tính tổng giá của một sản phẩm
  const getProductTotal = (item) => {
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) // Chuyển chuỗi giá thành số
        : parseFloat(item.total_price); // Nếu giá đã là số, giữ nguyên

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
                <Flex>
                  <Img
                    style={{ mixBlendMode: "multiply" }}
                    className="me-4"
                    src={`${BASE_URL}/uploads/products/${item.images}`}
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

                <Flex fontWeight="bold">
                  <span> Giá: </span>{" "}
                  <Text fontWeight="bold" style={{ marginLeft: "5px" }}>
                    {item.discountPrice
                      ? formatPrice(item.discountPrice)
                      : formatPrice(item.product_price)}
                  </Text>{" "}
                </Flex>

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
                    value={item.total_quantity}
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
                <Flex fontWeight="bold">
                  <span>
                    {" "}
                    Tổng giá: <br></br>
                  </span>
              

                  <Text
                    fontWeight="bold"
                    className={fadePrice === item.id ? "fade" : "show"}
                    style={{ marginLeft: "5px" }}
                  >
                    {formatPrice(getProductTotal(item))}
                  </Text>
                </Flex>
                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
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
