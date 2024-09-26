
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
  const [likedProducts, setLikedProducts] = useState([]);
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
  const [selectedProduct, setSelectedProduct] = useState(null); // Updated state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredResponse = await axios.get(`${BASE_URL}/api/products`);
        setFeaturedProducts(featuredResponse.data);
      } catch (error) {
        console.error("Error fetching data from API", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  // ================================================= gọi đến Model ==================================
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleSubmitModel = (e) => {
    e.preventDefault();
    // Form validation and submit logic
  };
  const handleCloseModal = () => setIsOpen(false);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
  const increaseQuantity = () => setQuantity(quantity + 1);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };


  const handleAddToCartAndOpenModal = (e, product) => {
    e.stopPropagation(); // Prevent the event from triggering the product link
    addToCart(product); // Call the function to add the product to the cart
    handleOpenModal(product); // Open the modal with the product details
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
  
      const existingProductIndex = cart.findIndex(
        (item) => item.id === product.id
      );
  
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

  // ========================================= thả tim sản phẩm ===============================================
  const toggleLike = (productId) => {
    if (likedProducts.includes(productId)) {
      setLikedProducts(likedProducts.filter((id) => id !== productId));
    } else {
      setLikedProducts([...likedProducts, productId]);
    }
  };

  // ===============================================================================================================
  const renderProductList = (products) => {
    return products.map((product) => (
      <div
        className="swiper-wrappe"
        style={{
          display: "flex",
          width: " 312px",
          marginBottom: "4px",
        }}
        key={product.id}
      >
        <div className="swiper-slide swiper-slide-active">
          <div className="product-box h-100 bg-gray relative">
            <button
              className="like-icon"
              onClick={() => toggleLike(product.id)}
            >
              <HeartIcon
                size="24px"
                color={likedProducts.includes(product.id) ? "#b29c6e" : "white"}
              />
            </button>
            <button
              className="add-to-cart-icon"
            
              onClick={(e) => handleAddToCartAndOpenModal(e, product)}
            >
              <FaShoppingCart
            
                size="25"
                style={{
                  color: "white",
                  stroke: "#b29c6e",
                  strokeWidth: 42,
                }}
              />
            </button>
            <div className="product-box">
              <a href={`/product/${product.id}`} className="plain">
                <div className="product-image">
                  <img
                    src={`${BASE_URL}/uploads/products/${product.image}`}
                    alt={product.name}
                  />
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
    setSelectedButton(buttonName); // Update the selected button when clicked
  };

  return (
    <div className="custom-slider-container">
      <div className="products_blocks_wrapper">
        <div className="left-content">
          <img
            src="https://www.watchstore.vn/images/block/compress/banner-dong-ho-cao-cap_1714020205.webp"
            alt="Luxury Watch"
          />
        </div>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          loop={true}
          autoplay={{
            delay: 2500, // Điều chỉnh thời gian chờ giữa các lần tự động chuyển slide
            disableOnInteraction: false,
          }}
          speed={3000} // Tốc độ chuyển slide (600ms)
          className="main-slider"
          slidesPerView={3}
        >
   <div className="button-brand">
            {/* Add border change based on selectedButton */}
            <button
              onClick={() => handleButtonClick("Tất cả")}
              className={selectedButton === "Tất cả" ? "active-button" : ""}
            >
              Tất cả
            </button>
            <button
              onClick={() => handleButtonClick("Giới hạn")}
              className={selectedButton === "Giới hạn" ? "active-button" : ""}
            >
              Giới hạn
            </button>
            <button
              onClick={() => handleButtonClick("Nam")}
              className={selectedButton === "Nam" ? "active-button" : ""}
            >
              Nam
            </button>
            <button
              onClick={() => handleButtonClick("Nữ")}
              className={selectedButton === "Nữ" ? "active-button" : ""}
            >
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
        decreaseQuantity={decreaseQuantity}
        increaseQuantity={increaseQuantity}
        selectedProduct={selectedProduct}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default CustomSlider;
