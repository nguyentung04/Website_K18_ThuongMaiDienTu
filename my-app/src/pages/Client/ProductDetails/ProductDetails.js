import React, { useState, useEffect, useRef } from "react";
import { Img, useDisclosure, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarRegular,
  faThumbsUp,
} from "@fortawesome/free-regular-svg-icons";
import {
  faTruckFast,
  faShieldAlt,
  faCertificate,
} from "@fortawesome/free-solid-svg-icons";
import { CameraIcon } from "../../../components/icon/icon";
import "./ProductDetails.css";
import ProductSimilar from "./../Home/component/ProductSimilar/ProductSimilar";
const BASE_URL = "http://localhost:3000";
const products = [];
const itemsPerPage = 4;
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]); // Khởi tạo mảng rỗng
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSimilar, setLoadingSimilar] = useState(true); // Trạng thái loading cho sản phẩm tương tự
  const productInfoRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const specificationsRef = useRef(null);
  const evaluateRef = useRef(null);
  const similarProductsRef = useRef(null);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const [showReplyForm, setShowReplyForm] = useState(false);

  const [replyContent, setReplyContent] = useState("");

  const [replyPhone, setReplyPhone] = useState("");

  const [showReplies, setShowReplies] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [productDetails, setProductDetails] = useState(null);
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
  const toast = useToast();
  const toggleReplies = (index) => {
    setShowReplies((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const review = {
      name: loggedInUser ? loggedInUser.name : "Anonymous",
      rating: userRating,
      comment,
      likes: 0,
      time: new Date().toLocaleString(),
      replies: [],
    };

    setReviews([...reviews, review]);
    setUserRating(0);
    setComment("");
  };
  const cancelReply = (formKey) => {
    setShowReplyForm((prev) => ({
      ...prev,
      [formKey]: false,
    }));
  };

  const handleReplyContentChange = (e) => setReplyContent(e.target.value);

  const handleLikeClick = (index) => {
    const updatedReviews = [...reviews];
    updatedReviews[index].likes = (updatedReviews[index].likes || 0) + 1;
    setReviews(updatedReviews);
  };

  const toggleReplyForm = (reviewIndex, replyIndex = null) => {
    const formKey =
      replyIndex !== null ? `${reviewIndex}-${replyIndex}` : reviewIndex;

    setShowReplyForm((prev) => ({
      ...prev,
      [formKey]: !prev[formKey],
    }));
  };

  const handleReplySubmit = (reviewIndex, replyIndex = null, e) => {
    e.preventDefault();

    if (!replyContent) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const newReply = {
      name: "Người dùng",
      content: replyContent,
      time: new Date().toLocaleString(),
      replies: [],
    };

    const updatedReviews = [...reviews];
    let targetReplies =
      replyIndex !== null
        ? updatedReviews[reviewIndex].replies[replyIndex].replies
        : updatedReviews[reviewIndex].replies;

    targetReplies.push(newReply);
    setReviews(updatedReviews);
    setReplyContent("");
    setShowReplyForm((prev) => ({
      ...prev,
      [`${reviewIndex}-${replyIndex}`]: false,
    }));
  };
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
        const response = await axios.get(`${BASE_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch reviews
  // useEffect(() => {
  //   const fetchReviews = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/api/products/${id}/reviews`);
  //       setReviews(response.data);
  //     } catch (error) {
  //       setError("Lỗi khi lấy dữ liệu đánh giá");
  //     }
  //   };
  //   fetchReviews();
  // }, [id]);

  // Fetch similar products
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (product && product.category_id) {
        setLoadingSimilar(true); // Bắt đầu loading cho sản phẩm tương tự
        try {
          const response = await axios.get(
            `${BASE_URL}/api/product/categories/${product.category_id}`
          );
          setSimilar(response.data.filter((p) => p.id !== product.id)); // Lọc sản phẩm không giống sản phẩm chính
        } catch (error) {
          setError("Lỗi khi lấy dữ liệu sản phẩm tương tự");
        } finally {
          setLoadingSimilar(false); // Kết thúc loading cho sản phẩm tương tự
        }
      }
    };

    fetchSimilarProducts();
  }, [product]);

  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const handleNext = () => {
    setCurrentPage((prevIndex) =>
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
  };
  const handlePrev = () => {
    setCurrentPage((prevIndex) =>
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };
  const startIndex = currentPage * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  const handleUserRatingClick = (index) => {
    setUserRating(index + 1);
  };
  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Tên khách hàng là bắt buộc";
    if (!formData.email) newErrors.email = "Địa chỉ email là bắt buộc";
    if (!formData.phone) newErrors.phone = "Số điện thoại là bắt buộc";
    if (!formData.province) newErrors.province = "Tỉnh là bắt buộc";
    if (!formData.city) newErrors.city = "Thành phố là bắt buộc";
    if (!formData.address) newErrors.address = "Địa chỉ nhận hàng là bắt buộc";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Chọn phương thức thanh toán";
    return newErrors;
  };
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
              // Single Image Display
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
        <div ref={evaluateRef} className="reviews-section">
          <h3 className="comment_title">ĐÁNH GIÁ</h3>
          <div className="comment-box">
            <form onSubmit={handleSubmit} className="comment-form">
              <div className="comment-rating">
                {[...Array(5)].map((star, index) => (
                  <FontAwesomeIcon
                    key={index}
                    icon={index < userRating ? faStarSolid : faStarRegular}
                    style={{ color: "#d0b349", cursor: "pointer" }}
                    onClick={() => handleUserRatingClick(index)}
                  />
                ))}
              </div>
              <div className="form-floating comment-content">
                <textarea
                  className="form-control"
                  placeholder="Nhập nội dung"
                  id="comment"
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ height: "100px" }}
                  required
                />
                <label htmlFor="comment">Nhập nội dung</label>
              </div>
              {/* Submit Button */}
              <div className="comment-submit">
                <button type="submit" className="submit_button">
                  Gửi đánh giá
                </button>
              </div>
            </form>
            <hr />
            <div className="reviews-list">
              {reviews.map((review, index) => (
                <div key={index} className="review">
                  <h3>{review.name}</h3>
                  <div className="review-rating">
                    {[...Array(5)].map((star, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={i < review.rating ? faStarSolid : faStarRegular}
                        style={{ color: "#d0b349" }}
                      />
                    ))}
                  </div>
                  <p>{review.comment}</p>
                  <div className="review-actions">
                    <button
                      onClick={() => handleLikeClick(index)}
                      className="like-button"
                    >
                      <FontAwesomeIcon icon={faThumbsUp} /> {review.likes || 0}
                    </button>
                    <button
                      onClick={() => toggleReplyForm(index)}
                      className="reply-button"
                    >
                      Trả lời
                    </button>
                    <span>| {review.time}</span>
                  </div>

                  {showReplyForm[index] && (
                    <form
                      onSubmit={(e) => handleReplySubmit(index, null, e)}
                      className="reply-form"
                    >
                      <div className="form-floating reply-content">
                        <textarea
                          className="form-group"
                          value={replyContent}
                          onChange={handleReplyContentChange}
                          placeholder="Nội dung trả lời"
                          required
                        />
                      </div>
                      <div className="button-reply">
                        <button
                          type="button"
                          className="cancel-reply-button"
                          onClick={() => cancelReply(index)}
                        >
                          Hủy
                        </button>
                        <button type="submit" className="submit-reply-button">
                          Gửi
                        </button>
                      </div>
                    </form>
                  )}
                  {review.replies && review.replies.length > 0 && (
                    <div>
                      {showReplies[index] && (
                        <div className="replies-list">
                          {review.replies.map((reply, replyIndex) => (
                            <div key={replyIndex} className="reply">
                              <h6>{reply.name}</h6>
                              <p>{reply.content}</p>
                              <div className="review-actions">
                                <button
                                  onClick={() => handleLikeClick(replyIndex)}
                                  className="like-button"
                                >
                                  <FontAwesomeIcon icon={faThumbsUp} />{" "}
                                  {reply.likes || 0}
                                </button>
                                <button
                                  onClick={() =>
                                    toggleReplyForm(index, replyIndex)
                                  }
                                  className="reply-button"
                                >
                                  Trả lời
                                </button>
                                <span>| {reply.time}</span>
                              </div>

                              {showReplyForm[`${index}-${replyIndex}`] && (
                                <form
                                  onSubmit={(e) =>
                                    handleReplySubmit(index, replyIndex, e)
                                  }
                                  className="reply-form"
                                >
                                  <div className="form-floating reply-content">
                                    <textarea
                                      className="form-group"
                                      value={replyContent}
                                      onChange={handleReplyContentChange}
                                      placeholder="Nội dung trả lời"
                                      required
                                    />
                                  </div>
                                  <div className="button-reply">
                                    <button
                                      type="button"
                                      className="cancel-reply-button"
                                      onClick={() =>
                                        cancelReply(`${index}-${replyIndex}`)
                                      }
                                    >
                                      Hủy
                                    </button>
                                    <button
                                      type="submit"
                                      className="submit-reply-button"
                                    >
                                      Gửi
                                    </button>
                                  </div>
                                </form>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => toggleReplies(index)}
                        className="toggle-replies-button"
                      >
                        {showReplies[index]
                          ? "Thu gọn phản hồi"
                          : `Hiển thị ${review.replies.length} phản hồi`}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div  ref={similarProductsRef} className="home-banchay">
          <ProductSimilar categoryId={product.category_id} />
        </div>
       
      </div>
    </div>
  );
};
export default ProductDetails;