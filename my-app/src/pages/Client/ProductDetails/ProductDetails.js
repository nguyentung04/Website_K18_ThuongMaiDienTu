import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruckFast,
  faShieldAlt,
  faCertificate,
} from "@fortawesome/free-solid-svg-icons";
import { CameraIcon } from "../../../components/icon/icon";
import "./ProductDetails.css";
import ProductSimilar from "./../Home/component/ProductSimilar/ProductSimilar";
import Reviews from "./../Home/component/Reviews/Reviews";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:3000";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productInfoRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const specificationsRef = useRef(null);
  const evaluateRef = useRef(null);
  const similarProductsRef = useRef(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [userData, setUserData] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const scrollToProductInfo = () => {
    productInfoRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToSpecifications = () => {
    specificationsRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToEvaluate = () => {
    evaluateRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToSimilarProducts = () => {
    similarProductsRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Lấy sản phẩm từ API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/product_detail/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // ========================================= hàm thêm sản phẩm vào giỏ hàng -=---=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  const handleAddToCart = async (e, product, shouldNavigate = false) => {
    e.stopPropagation();

    if (isAddingToCart) return; // Không thực hiện nếu đang xử lý thêm vào giỏ hàng

    await addToCart(product, shouldNavigate);
    // handleOpenModal(product);
  };

  const addToCart = async (product, shouldNavigate = false) => {
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
          product_id: id,
          quantity,
          price: product.price,
          total: quantity * product.price,
        },
      ],
    };

    setIsAddingToCart(true);
    // Chỉ chuyển trang nếu `shouldNavigate` là true
    if (shouldNavigate == true) {
      navigate("/cart");
    }
    try {
      const response = await axios.post(`${BASE_URL}/api/cart`, cartData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm token vào header nếu cần
        },
      });
  
      if (response.data.message) {
        toast.success("Thêm vào giỏ hàng thành công!", {
        position: "bottom-center",
          autoClose: 5000,
        });
      } else {
        toast.error(response.data.error || "Đã xảy ra lỗi, vui lòng thử lại.", {
        position: "bottom-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại.",
        {
        position: "bottom-center",
          autoClose: 5000,
        }
      );
    } finally {
      setIsAddingToCart(false);
    }
  };
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="product-details">
      <div className="container">
        <hr />
        <div className="product-detail-container">
          <div className="product-image-section">
            {product.images &&
            Array.isArray(product.images) &&
            product.images.length > 0 ? (
              <div className="image-slider-container"></div>
            ) : (
              <img
                src={`${BASE_URL}/uploads/products/${product.image_url}`}
                alt={product.name}
                className="product-image"
              />
            )}
          </div>
          <div className="product-info-section">
            <h1 className="product-name">{product.name}</h1>
            <p className="product-rating">{product.short_description}</p>

            <div className="flex_item">
              <p className="product-price">Giá: {formatPrice(product.price)}</p>
            </div>

            <div className="action-buttons">
              {/* ĐẶT HÀNG chuyển trang */}
              <button
                className="order-button"
                onClick={(e) => handleAddToCart(e, product, true)}
                disabled={isAddingToCart}
              >
                ĐẶT HÀNG
              </button>

              {/* THÊM VÀO GIỎ HÀNG chỉ thông báo */}
              <button
                className="order-button"
                onClick={(e) => handleAddToCart(e, product, false)}
                disabled={isAddingToCart}
              >
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>

            <div className="commitments">
              <label className="title_support">CAM KẾT CỦA CHÚNG TÔI</label>
              <div className="commitments1">
                <div className="commitment-item">
                  <FontAwesomeIcon
                    icon={faTruckFast}
                    style={{
                      marginRight: "8px",
                      color: "#d0b349",
                      fontSize: "24px",
                    }}
                  />
                  <p>Miễn phí vận chuyển toàn quốc</p>
                </div>
                <div className="commitment-item">
                  <FontAwesomeIcon
                    icon={faShieldAlt}
                    style={{
                      marginRight: "8px",
                      color: "#d0b349",
                      fontSize: "24px",
                    }}
                  />
                  <p>Bảo hành 5 năm với quy trình xử lý nhanh chóng</p>
                </div>
                <div className="commitment-item">
                  <FontAwesomeIcon
                    icon={faCertificate}
                    style={{
                      marginRight: "8px",
                      color: "#d0b349",
                      fontSize: "24px",
                    }}
                  />
                  <p>Sản phẩm chính hãng được chứng nhận</p>
                </div>
                <div className="commitment-item">
                  <CameraIcon
                    style={{
                      marginRight: "8px",
                      color: "#d0b349",
                      fontSize: "39px",
                    }}
                  />
                  <p>Hàng có sẵn - Có ảnh thật theo yêu cầu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="liist">
          <div className="button_scrollToProductInfo">
            <ul>
              <li>
                <button
                  onClick={scrollToProductInfo}
                  className="scroll-button introduce"
                >
                  MÔ TẢ SẢN PHẨM
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToSpecifications}
                  className="scroll-button parameter"
                  
                >
                  THÔNG SỐ
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToEvaluate}
                  className="scroll-button Evaluate"
                >
                  ĐÁNH GIÁ
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToSimilarProducts}
                  className="scroll-button similar-products"
                >
                  SẢN PHẨM TƯƠNG TỰ
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div ref={productInfoRef} className="introduction-section">
          <h2>MÔ TẢ SẢN PHẨM</h2>
          <div
            className={`introduction-content ${
              isExpanded ? "expanded" : "collapsed"
            }`}
          >
            <p>{product.description}</p>
          </div>
          <div className="toggleExpand-button">
            <button onClick={toggleExpand} className="toggle-button">
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
        </div>
        <div ref={specificationsRef} className="bg-gray" >
          <div className="m-product-specification">
            <div className="m-product-specification__list">
              <x className="m-product-specification__name_full">
                <h2>THÔNG SỐ</h2>
              </x>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">Thương hiệu : </span>
                <span className="m-product-specification__name">
                   {product.category || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">Chất liệu dây : </span>
                <span className="m-product-specification__name">
                   {product.wire_material || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">Tên sản phẩm : </span>
                <span className="m-product-specification__name"> {product.name}</span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">Đường kính mặt đồng hồ : </span>
                <span className="m-product-specification__name"> {product.diameter || "N/A"} mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* đánh giá */}
        <div ref={evaluateRef} className="home-banchay">
          <Reviews productId={id} />
        </div>

        {/* Sản phẩm tương tự */}
        <div ref={similarProductsRef}>
          <ProductSimilar id={id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
