import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartIcon } from "../../../../../components/icon/icon";
import { Autoplay } from "swiper/modules";
import OrderModal from "../../../../../components/Client/orderModel/orderModel";

 import "./best_selling_products.css";

const BASE_URL = "http://localhost:3000";

const BestSellingProducts = () => {
  const [featuredProducts, setBestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
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
        setBestSellingProducts(featuredResponse.data);

        // Restore liked products from local storage
        const savedLikedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
        setLikedProducts(savedLikedProducts);

        // Initialize like counts for products
        const initialLikeCounts = {};
        featuredResponse.data.forEach((product) => {
          initialLikeCounts[product.id] = product.like_count || 0;
        });
        setLikeCounts(initialLikeCounts);
      } catch (error) {
        console.error("Error fetching data from API", error);
        setErrors({ fetch: "Unable to load products. Please try again later." });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleLike = async (productId) => {
    const userId = JSON.parse(localStorage.getItem('userData')).id;
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

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleSubmitModel = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    console.log("Submitting data:", formData);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsOpen(false);
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
    setErrors({});
  };

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

  return (
    <div className="best_selling_products">
      <h2>Sản phẩm khuyến mãi</h2>
      <div className="products_blocks_wrapper">
        <Swiper
          spaceBetween={10}
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
              <SwiperSlide key={index} className="swiper-slide">
                <div className="swiper-wrappe">
                  <div className="product-box bg-gray">
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
                    <a href={`/product/${product.id}`} className="plain">
                      <img
                        src={`${BASE_URL}/uploads/products/${product.images}`}
                        alt={product.name}
                      />
                      <div className="product-info">
                        <p className="product-title">{product.name}</p>
                        <div className="product-price">
                          {product.discountPrice ? (
                            <p className="line-through">{formatPrice(product.price)}</p>
                          ) : (
                            <p>{formatPrice(product.price)}</p>
                          )}
                          {product.discountPrice && (
                            <span className="discount-price">
                              {formatPrice(product.discountPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
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

export default BestSellingProducts;