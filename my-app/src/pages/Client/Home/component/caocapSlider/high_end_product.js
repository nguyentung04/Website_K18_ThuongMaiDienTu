import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartIcon } from "../../../../../components/icon/icon";
import { Autoplay } from "swiper/modules";
import OrderModal from "../../../../../components/Client/orderModel/orderModel";

import "./high_end_product.css";
const BASE_URL = "http://localhost:3000";

const CustomSlider = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState([]); // Lưu danh sách sản phẩm đã thích
  const [likeCount, setLikeCount] = useState({}); // Lưu số lượt thích cho mỗi sản phẩm
  const [selectedButton, setSelectedButton] = useState("Tất cả");
  const [isOpen, setIsOpen] = useState(false);
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

  const handleAddToCartAndOpenModal = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    handleOpenModal(product);
  };

  const addToCart = (product) => {
    if (product) {
      const details = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        quantity: quantity,
      };

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProductIndex = cart.findIndex((item) => item.id === product.id);

      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += quantity;
      } else {
        cart.push(details);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

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
            <button className="add-to-cart-icon" onClick={(e) => handleAddToCartAndOpenModal(e, product)}>
              <FaShoppingCart size="25" style={{ color: "white", stroke: "#b29c6e", strokeWidth: 42 }} />
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
      <OrderModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmitModel}
        errors={errors}
        quantity={quantity}
        decreaseQuantity={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
        increaseQuantity={() => setQuantity(quantity + 1)}
        selectedProduct={selectedProduct}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default CustomSlider;