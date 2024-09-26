
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartIcon } from "../../../../../components/icon/icon";
import { Autoplay } from "swiper/modules";
import OrderModal from "../../../../../components/Client/orderModel/orderModel"; // Import the new modal component

import "./Featured_products.css";

const BASE_URL = "http://localhost:3000";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState([]);
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
        const featuredResponse = await axios.get(
          `${BASE_URL}/api/products_noibat`
        );
        setFeaturedProducts(featuredResponse.data);
      } catch (error) {
        console.error("Error fetching data from API", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
 // ========================================= thả tim sản phẩm ===============================================
  const toggleLike = (productId) => {
    if (likedProducts.includes(productId)) {
      setLikedProducts(likedProducts.filter((id) => id !== productId));
    } else {
      setLikedProducts([...likedProducts, productId]);
    }
  };
  // ============================================= gọi đến model ======================================================
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
// ===============================================================================================================
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="FeaturedProducts">
      <div className="row align-items-center">
        <div className="col fix-title uppercase">
          <h2>sản phẩm bán chạy</h2>
        </div>
      </div>
      <div className="products_blocks_wrapper">
        <Swiper
          spaceBetween={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={3000}
          modules={[Autoplay]}
          className="main-slider"
          slidesPerView={4}
        >
          {loading ? (
            <SwiperSlide>Loading...</SwiperSlide>
          ) : (
            featuredProducts.map((product, index) => (
              <SwiperSlide key={index} style={{ display: "flex" }}>
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
                          color={
                            likedProducts.includes(product.id)
                              ? "#b29c6e"
                              : "white"
                          }
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
                            <p className="product-price">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
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

export default FeaturedProducts;
