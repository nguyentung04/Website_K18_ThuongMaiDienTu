import React, { useState, useEffect, useRef } from "react";
import { Img, useDisclosure } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faTruckFast,
  faShieldAlt,
  faCertificate,
} from "@fortawesome/free-solid-svg-icons";
import { CameraIcon } from "../../../components/icon/icon";
import "./ProductDetails.css";
import ProductSimilar from "./../Home/component/ProductSimilar/ProductSimilar";
import Reviews from "./../Home/component/Reviews/Reviews";
const BASE_URL = "http://localhost:3000";

const ProductDetails = ({ user }) => {
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
  const [reviews] = useState([]);
  const [userData, setUserData] = useState(null); // Khai báo state để lưu dữ liệu người dùng

  const [setProductDetails] = useState(null);
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
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/product_detail/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  console.log(product);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const { onOpen } = useDisclosure();
  const addToCart = () => {
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
  const openModal = () => {
    if (product) {
      const details = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        quantity: quantity,
      };
      setProductDetails(details);
      onOpen();
    }
  };
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

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
        <div class="container-menu" id="logo thương hiệu & menu">
          <div class="brand-logo">
            <Img
              src="my-app/public/logo192.png"
              loading="lazy"
              alt="Đồng hồ Citizen"
              height="100"
              width="150"
              class="img-fluid"
            />
          </div>
        </div>
        <hr />
        <div className="product-detail-container">
          <div className="product-image-section">
            {product.images &&
            Array.isArray(product.images) &&
            product.images.length > 0 ? (
              <div className="image-slider-container"></div>
            ) : (
              <img
                src={`${BASE_URL}/uploads/products/${product.image}`}
                alt={product.name}
                className="product-image"
              />
            )}
          </div>
          <div className="product-info-section">
            <h1 className="product-name">{product.name}</h1>
            <div className="product-rating">
              {[...Array(5)].map((star, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={
                    index < Math.round(averageRating)
                      ? faStarSolid
                      : faStarRegular
                  }
                  style={{ color: "#d0b349" }}
                />
              ))}
              |{" "}
              <span>
                {averageRating > 0
                  ? `${averageRating.toFixed(1)}/5`
                  : "Chưa có bình luận nào"}
              </span>
            </div>
            <div className="flex_item">
              <p className="product-price">{formatPrice(product.price)}</p>
            </div>
            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="order-button" onClick={openModal}>
                ĐẶT HÀNG
              </button>{" "}
              <button className="order-button" onClick={addToCart}>
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
                  GIỚI THIỆU
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
          <h2>GIỚI THỆU</h2>

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
        <div ref={specificationsRef} className="bg-gray">
          <div className="m-product-specification">
            <div className="m-product-specification__list">
              <div className="m-product-specification__name_full">
                <h2>THÔNG SỐ</h2>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">
                  Thương hiệu
                </span>
                <span className="m-product-specification__name">
                  : {product.category_name || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">SKU</span>
                <span className="m-product-specification__name">
                  : {product.identification || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">Loại máy</span>
                <span className="m-product-specification__name">
                  : {product.machineType || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">độ dầy</span>
                <span className="m-product-specification__name">
                  : {product.thickness || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">
                  Chất liệu dây đeo
                </span>
                <span className="m-product-specification__name">
                  : {product.wireMaterial || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">
                  Chống nước
                </span>
                <span className="m-product-specification__name">
                  : {product.antiWater || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">
                  Giới tính
                </span>
                <span className="m-product-specification__name">
                  : {product.gender || "Unisex"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">Màu sắc</span>
                <span className="m-product-specification__name">
                  : {product.coler || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* đánh giá */}

        {/* Reviews Section */}
        <div ref={evaluateRef} className="home-banchay">
          <Reviews productId={id} user={user} userData={userData} />
        </div>

        <div ref={similarProductsRef} className="home-banchay">
          <ProductSimilar categoryId={product.category_id} />
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
