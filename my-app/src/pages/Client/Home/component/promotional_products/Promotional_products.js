import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartIcon } from "../../../../../components/icon/icon";
import { Autoplay } from "swiper/modules";
import OrderModal from "../../../../../components/Client/orderModel/orderModel";
import "./Promotional_products.css";

const BASE_URL = "http://localhost:3000";

const PromotionalProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});

  // Existing state variables remain unchanged
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
          `${BASE_URL}/api/products_khuyenmai`
        );
        setFeaturedProducts(featuredResponse.data);

        // Initialize like counts and restore liked products
        const savedLikedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
        setLikedProducts(savedLikedProducts);

        const initialLikeCounts = {};
        featuredResponse.data.forEach((product) => {
          initialLikeCounts[product.id] = product.like_count || 0;
        });
        setLikeCounts(initialLikeCounts);
      } catch (error) {
        console.error("Error fetching data from API", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // New function to handle liking/unliking products
  const toggleLike = async (productId) => {
    const userId = JSON.parse(localStorage.getItem('userData')).id;
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/product/${productId}/like`, { userId });

      setLikedProducts((prevLiked) => {
        const updatedLiked = prevLiked.includes(productId)
          ? prevLiked.filter((id) => id !== productId)
          : [...prevLiked, productId];

        localStorage.setItem("likedProducts", JSON.stringify(updatedLiked));
        return updatedLiked;
      });

      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [productId]: response.data.likeCount,
      }));
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Existing functions remain unchanged
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
    e.stopPropagation();
    addToCart(product);
    handleOpenModal(product);
  };

  const addToCart = (product) => {
    // Existing addToCart logic
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="PromotionalProducts">
      <div className="row align-items-center">
        <div className="col fix-title uppercase">
          <h2>Sản phẩm khuyến mãi</h2>
        </div>
      </div>
      <div className="products_blocks_wrapper">
        <Swiper
          spaceBetween={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={2000}
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
                  style={{ display: "flex", width: "312px", marginBottom: "4px" }}
                >
                  <div className="swiper-slide swiper-slide-active">
                    <div className="product-box h-100 bg-gray relative">
                      <button className="like-icon" onClick={() => toggleLike(product.id)}>
                        <HeartIcon
                          size="24px"
                          color={likedProducts.includes(product.id) ? "#b29c6e" : "white"}
                        />
                        <span>{likeCounts[product.id] || 0}</span>
                      </button>
                      <button className="add-to-cart-icon" onClick={(e) => handleAddToCartAndOpenModal(e, product)}>
                        <FaShoppingCart
                          size="25"
                          style={{ color: "white", stroke: "#b29c6e", strokeWidth: 42 }}
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

export default PromotionalProducts;