import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartIcon } from "../../../../../components/icon/icon";
import { Autoplay } from "swiper/modules";
import OrderModal from "../../../../../components/Client/orderModel/orderModel";
import "./Promotional_products.css";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:3000";

const PromotionalProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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
        const featuredResponse = await axios.get(`${BASE_URL}/api/products`);
        setFeaturedProducts(featuredResponse.data);

        // Initialize like counts and restore liked products
        const savedLikedProducts =
          JSON.parse(localStorage.getItem("likedProducts")) || [];
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
    const userId = JSON.parse(localStorage.getItem("userData")).id;
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/product/${productId}/like`,
        { userId }
      );

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

  // ======================================================================================================

  // const handleAddToCartAndOpenModal = (e, product) => {
  //   e.stopPropagation();
  //   addToCart(product);
  //   handleOpenModal(product);
  // };

  const handleAddToCartAndOpenModal = async (e, product) => {
    e.stopPropagation();

    if (isAddingToCart) return; // Không thực hiện nếu đang xử lý thêm vào giỏ hàng

    await addToCart(product);
  };
  // ======================================================================================================
  const addToCart = async (product) => {
    if (!product) return;

    const userId = JSON.parse(localStorage.getItem("userData"))?.id;

    if (!userId) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored", // Optional: change toast theme
      });
      return;
    }

    if (product.stock < quantity) {
      toast.error("Số lượng sản phẩm không đủ. Vui lòng giảm số lượng.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
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
          Authorization: "Bearer <token>", // if required
        },
      });

      if (response.data.success) {
        toast.success("Thêm vào giỏ hàng thành công!", {
          position: "top-right",
          autoClose: 5000, // thời gian tự động đóng
        });
      } else {
        toast.error(
          response.data.message || "Đã xảy ra lỗi, vui lòng thử lại.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Có lỗi xảy ra", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (error.request) {
        toast.error("Không thể kết nối tới server", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  // ======================================================================================================
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
          <h2>Sản phẩm bán chạy</h2>
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
                  style={{
                    display: "flex",
                    width: "312px",
                    marginBottom: "4px",
                  }}
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
                        {/* <span>{likeCounts[product.id] || 0}</span> */}
                      </button>
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
                            <img
                              src={`${BASE_URL}/uploads/products/${product.images}`}
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
