import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartIcon } from "../../../../../components/icon/icon";
import { Autoplay } from "swiper/modules";
import OrderModal from "../../../../../components/Client/orderModel/orderModel";

import "./high_end_product.css";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
const BASE_URL = "http://localhost:3000";

const CustomSlider = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState([]); // Lưu danh sách sản phẩm đã thích
  const [likeCount, setLikeCount] = useState({}); // Lưu số lượt thích cho mỗi sản phẩm
  const [selectedButton, setSelectedButton] = useState("Tất cả");
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [userData, setUserData] = useState(null);
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
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // =-----------------------------------------------------===================================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        const decoded = jwtDecode(token);
        setUserData(decoded);
    }
}, []);

  useEffect(() => {
    const fetchUserIdFromToken = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) {
          throw new Error("Token không tồn tại, vui lòng đăng nhập lại.");
        }
    
        const decodedToken = jwtDecode(token); // Giải mã token
        const userId = decodedToken.id; // Sử dụng đúng key từ payload của token
        if (!userId) {
          throw new Error("Không tìm thấy userId trong token.");
        }
    
        localStorage.setItem("userId", userId); // Lưu userId vào localStorage nếu cần
        return userId;
      } catch (error) {
        console.error("Lỗi khi lấy userId từ token:", error);
        setErrors("Vui lòng đăng nhập lại."); // Gán lỗi nếu cần thiết
        setLoading(false);
        return null;
      }

    
    };
    
  
    fetchUserIdFromToken();
  }, []);

  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredResponse = await axios.get(`${BASE_URL}/api/products`);
        setFeaturedProducts(featuredResponse.data);

        // Khởi tạo số lượt thích cho mỗi sản phẩm
        const initialLikeCount = {};
        featuredResponse.data.forEach(product => {
          initialLikeCount[product.id] = 0; // Mặc định là 0 lượt thích
        });
        setLikeCount(initialLikeCount);
      } catch (error) {
        console.error("Error fetching data from API", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleCloseModal = () => setIsOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };
// ========================================= hàm thêm sản phẩm vào giỏ hàng -=---=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const handleAddToCartAndOpenModal = async (e, product) => {
  e.stopPropagation();

  if (isAddingToCart) return; // Không thực hiện nếu đang xử lý thêm vào giỏ hàng

  await addToCart(product);
  // handleOpenModal(product);
};

const addToCart = async (product) => {
  if (!userData || !userData.id) {
    toast.error("Vui lòng đăng nhập.");
    return;
}
  if (!product) return;

  const token = localStorage.getItem("token");
  if (!token) throw new Error("Người dùng chưa được xác thực");

  const decoded = jwtDecode(token);
  const userId = decoded.id; // Sử dụng đúng key theo cấu trúc của token

  if (!userId) {
    throw new Error("Không tìm thấy userId trong token.");
  }

  if (!token) {
    toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.", {
      position: "top-right",
      autoClose: 5000,
    });
    return;
  }



  if (!userId) {
    toast.error("Thông tin người dùng không hợp lệ.", {
      position: "top-right",
      autoClose: 5000,
    });
    return;
  }

  if (product.stock < quantity) {
    toast.error("Số lượng sản phẩm không đủ. Vui lòng giảm số lượng.", {
      position: "top-right",
      autoClose: 5000,
    });
    return;
  }

  const cartData = {
    user_id: userId,
    cart_items: [
      {
        product_id: product.id,
        quantity,
        price: product.price,
        total: quantity * product.price,
      },
    ],
  };

  setIsAddingToCart(true);

  try {
    const response = await axios.post(`${BASE_URL}/api/cart`, cartData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header nếu cần
      },
    });

    if (response.data.success) {
      toast.success("Thêm vào giỏ hàng thành công!", {
        position: "top-right",
        autoClose: 5000,
      });
    } else {
      toast.error(response.data.message || "Đã xảy ra lỗi, vui lòng thử lại.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast.error(
      error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
      {
        position: "top-right",
        autoClose: 5000,
      }
    );
  } finally {
    setIsAddingToCart(false);
  }
};
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-======================================-===============================-=-=-=======================-
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const toggleLike = async (productId) => {
    const userId = JSON.parse(localStorage.getItem('user')).id; // Lấy userId từ localStorage
    try {
      const response = await axios.post(`http://localhost:3000/api/product/${productId}/like`, { userId });
      // Xử lý phản hồi
    } catch (error) {
      console.error("Lỗi khi cập nhật lượt thích:", error);
    }
  };
  

  const renderProductList = (products) => {
    return products.map((product) => (
      <div className="swiper-wrappe" style={{ display: "flex", width: "312px", marginBottom: "4px" }} key={product.id}>
        <div className="swiper-slide swiper-slide-active">
          <div className="product-box h-100 bg-gray relative">
          <button
                        className="add-to-cart-icon"
                        onClick={(e) => handleAddToCartAndOpenModal(e, product)}
                        disabled={isAddingToCart}
                      >
                        {isAddingToCart ? (
                          "Đang thêm..."
                        ) : (
                          <FaShoppingCart
                            size="25"
                            style={{
                              color: "white",
                              stroke: "#b29c6e",
                              strokeWidth: 42,
                            }}
                          />
                        )}
                      </button>
            <div className="product-box">
              <a href={`/product/${product.id}`} className="plain">
                <div className="product-image">
                  <img src={`${BASE_URL}/uploads/products/${product.images}`} alt={product.name} />
                </div>
                <div className="product-info">
                  <p className="product-title">{product.name}</p>
                  <p className="product-price">{formatPrice(product.price)}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const handleSubmitModel = (e) => {
    e.preventDefault();
    // Logic xử lý form gửi đi
    console.log("Form data submitted:", formData);
    handleCloseModal();
  };

  return (
    <div className="custom-slider-container">
      <div className="products_blocks_wrapper">
        <div className="left-content">
          <img src="https://www.watchstore.vn/images/block/compress/banner-dong-ho-cao-cap_1714020205.webp" alt="Luxury Watch" />
        </div>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          speed={3000}
          className="main-slider"
          slidesPerView={3}
        >
          <div className="button-brand">
            <button onClick={() => handleButtonClick("Tất cả")} className={selectedButton === "Tất cả" ? "active-button" : ""}>
              Tất cả
            </button>
            <button onClick={() => handleButtonClick("Giới hạn")} className={selectedButton === "Giới hạn" ? "active-button" : ""}>
              Giới hạn
            </button>
            <button onClick={() => handleButtonClick("Nam")} className={selectedButton === "Nam" ? "active-button" : ""}>
              Nam
            </button>
            <button onClick={() => handleButtonClick("Nữ")} className={selectedButton === "Nữ" ? "active-button" : ""}>
              Nữ
            </button>
          </div>
          {loading ? (
            <SwiperSlide>Loading...</SwiperSlide>
          ) : (
            featuredProducts.map((product, index) => (
              <SwiperSlide key={index} style={{ display: "flex" }}>
                {renderProductList([product])}
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>

    </div>
  );
};

export default CustomSlider;