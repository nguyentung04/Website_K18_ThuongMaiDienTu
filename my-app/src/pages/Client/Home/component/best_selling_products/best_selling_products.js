import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { HeartIcon } from "../../../../../components/icon/icon";
import { Autoplay } from "swiper/modules";

import "./best_selling_products.css";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:3000";

const BestSellingProducts = () => {
  const [featuredProducts, setBestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
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
        setBestSellingProducts(featuredResponse.data);

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

  
  
//   const addToCart = async (product, cart) => {
//     if (!userData || !userData.id) {
//       toast.error("Vui lòng đăng nhập.");
//       return;
//     }
//     if (!product) return;

//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("Người dùng chưa được xác thực");

//     const decoded = jwtDecode(token);
//     const userId = decoded.id;

//     if (!userId) {
//       toast.error("Thông tin người dùng không hợp lệ.", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//       return;
//     }

//     if (product.stock < quantity) {
//       toast.error("Số lượng sản phẩm không đủ. Vui lòng giảm số lượng.", {
//         position: "top-right",
//         autoClose: 5000,
//       });
//       return;
//     }

//     setIsAddingToCart(true);

//     try {
//       // Lấy giỏ hàng hiện tại của người dùng
//       const currentCartResponse = await axios.get(
//         `${BASE_URL}/api/cart_userId1/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const currentCart = currentCartResponse.data.cart || { cart_items: [] };

//       const existingCartItemIndex = currentCart.cart_items.findIndex(
//         (item) => item.product_id === product.id 
//       );
// console.log(currentCart);
// console.log(currentCartResponse);
//       let cartData;

//       if (existingCartItemIndex !== -1) {
//         // Nếu sản phẩm đã tồn tại, cập nhật số lượng
//         const updatedCartItems = [...currentCart.cart_items];
//         const existingCartItem = updatedCartItems[existingCartItemIndex];
//         const newQuantity = existingCartItem.quantity + quantity;

//         if (newQuantity > product.stock) {
//           toast.error("Số lượng sản phẩm không đủ. Vui lòng giảm số lượng.", {
//             position: "top-right",
//             autoClose: 5000,
//           });
//           setIsAddingToCart(false);
//           return;
//         }

//         updatedCartItems[existingCartItemIndex] = {
//           ...existingCartItem,
//           quantity: newQuantity,
//           total: newQuantity * product.price,
//         };

//         cartData = {
//           user_id: userId,
//           cart_items: updatedCartItems,
//         };

//         const responseUpdated = await axios.put(
//           `${BASE_URL}/api/cart/${userId}`,
//           cartData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (responseUpdated.data.success) {
//           toast.success("Cập nhật giỏ hàng thành công!", {
//             position: "top-right",
//             autoClose: 5000,
//           });
//         } else {
//           toast.error(
//             responseUpdated.data.message || "Đã xảy ra lỗi, vui lòng thử lại.",
//             {
//               position: "top-right",
//               autoClose: 5000,
//             }
//           );
//         }
//       } else {
//         // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
//         const newCartItem = {
//           product_id: product.id,
//           quantity,
//           price: product.price,
//           total: quantity * product.price,
//         };

//         cartData = {
//           user_id: userId,
//           cart_items: [...currentCart.cart_items, newCartItem],
//         };

//         const response = await axios.put(
//           `${BASE_URL}/api/cart/${userId}`,
//           cartData,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (response.data.success) {
//           toast.success("Thêm sản phẩm vào giỏ hàng thành công!", {
//             position: "top-right",
//             autoClose: 5000,
//           });
//         } else {
//           toast.error(
//             response.data.message || "Đã xảy ra lỗi, vui lòng thử lại.",
//             {
//               position: "top-right",
//               autoClose: 5000,
//             }
//           );
//         }
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast.error(
//         error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.",
//         {
//           position: "top-right",
//           autoClose: 5000,
//         }
//       );
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="best_selling_products">
      <h2>Sản phẩm</h2>
      <div className="products_blocks_wrapper">
        <Swiper
          spaceBetween={10}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={3000}
          modules={[Autoplay]}
          className="main-slider"
          slidesPerView={6}
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
                    <a href={`/product/${product.id}`} className="plain">
                      <img
                        src={`${BASE_URL}/uploads/products/${product.images}`}
                        alt={product.name}
                      />
                      <div className="product-info">
                        <p className="product-title">{product.name}</p>
                        <div className="product-price">
                          {product.discountPrice ? (
                            <p className="line-through">
                              {formatPrice(product.price)}
                            </p>
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
    </div>
  );
};

export default BestSellingProducts;
