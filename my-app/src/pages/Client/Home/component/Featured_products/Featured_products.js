import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartIcon } from "../../../../../components/icon/icon";
import { Autoplay } from "swiper/modules";
import OrderModal from "../../../../../components/Client/orderModel/orderModel";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./Featured_products.css";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:3000";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [userData, setUserData] = useState(null);
  
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
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredResponse = await axios.get(`${BASE_URL}/api/products`);
        setFeaturedProducts(featuredResponse.data);

        // Restore liked products from local storage
        const savedLikedProducts =
          JSON.parse(localStorage.getItem("likedProducts")) || [];
        setLikedProducts(savedLikedProducts);

        // Initialize like counts for products
        const initialLikeCounts = {};
        featuredResponse.data.forEach((product) => {
          initialLikeCounts[product.id] = product.like_count || 0;
        });
        setLikeCounts(initialLikeCounts);
      } catch (error) {
        console.error("Error fetching data from API", error);
        setErrors({
          fetch: "Unable to load products. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleLike = async (productId) => {
    const userId = JSON.parse(localStorage.getItem("userData")).id;
    // try {
    //   const response = await axios.post(
    //     `${BASE_URL}/api/product/${productId}/like`,
    //     { userId }
    //   );

    //   setLikedProducts((prevLiked) => {
    //     const updatedLiked = prevLiked.includes(productId)
    //       ? prevLiked.filter((id) => id !== productId)
    //       : [...prevLiked, productId];

    //     localStorage.setItem("likedProducts", JSON.stringify(updatedLiked));
    //     return updatedLiked;
    //   });

    //   setLikeCounts((prevCounts) => ({
    //     ...prevCounts,
    //     [productId]: response.data.likeCount,
    //   }));
    // } catch (error) {
    //   console.error("Error updating likes:", error);
    // }
  };

  // =================================================================================

  // =================================================================================
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

  // const handleAddToCartAndOpenModal = (e, product) => {

  //   e.stopPropagation();
  //   addToCart(product);
  //   handleOpenModal(product);
  // };

  const handleAddToCartAndOpenModal = async (e, product) => {
    e.stopPropagation();

    if (isAddingToCart) return; // Không thực hiện nếu đang xử lý thêm vào giỏ hàng

    await addToCart(product);
    // handleOpenModal(product);
  };

  // const addToCart = (product) => {
  //   if (product) {
  //     const details = {
  //       id: product.id,
  //       name: product.name,
  //       price: product.price,
  //       description: product.description,
  //       image: product.image,
  //       quantity: quantity,
  //     };

  //     const cart = JSON.parse(localStorage.getItem("cart")) || [];
  //     const existingProductIndex = cart.findIndex(
  //       (item) => item.id === product.id
  //     );

  //     if (existingProductIndex !== -1) {
  //       cart[existingProductIndex].quantity += quantity;
  //     } else {
  //       cart.push(details);
  //     }

  //     localStorage.setItem("cart", JSON.stringify(cart));
  //   }
  // };


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
  

  // const userId = JSON.parse(localStorage.getItem("userData"))?.id;
  // if (!userId) {
  //   alert("Vui lòng đăng nhập để sử dụng tính năng này.");
  //   return;
  // }

  // =================================================================================
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="FeaturedProducts">
      <ToastContainer />

      <div className="row align-items-center">
        <div className="col fix-title uppercase">
          <h2>Sản phẩm nổi bật</h2>
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
            featuredProducts.map((product) => (
              <SwiperSlide className="swiper-wrappe" key={product.id} style={{ display: "flex" }}>
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
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedProducts;



