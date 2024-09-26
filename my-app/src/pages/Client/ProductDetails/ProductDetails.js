import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Text,
  Heading,
  Divider,
  Img,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Modal,
  useDisclosure,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons"; // Full star icon
import {
  faStar as faStarRegular,
  faThumbsUp,
} from "@fortawesome/free-regular-svg-icons"; // Regular star and thumbs up icons
import {
  faTruckFast,
  faShieldAlt,
  faCertificate,
} from "@fortawesome/free-solid-svg-icons"; // Additional icons
import { CameraIcon } from "../../../components/icon/icon"; // Adjust import path

import "./ProductDetails.css";

const BASE_URL = "http://localhost:3000"; // API base URL

const products = [
  {
    id: 1,
    name: "Sản phẩm 1",
    price: "100.000 VND",
    image: "https://linktoimage1.com",
  },
  {
    id: 2,
    name: "Sản phẩm 2",
    price: "200.000 VND",
    image: "https://linktoimage2.com",
  },
  {
    id: 3,
    name: "Sản phẩm 3",
    price: "300.000 VND",
    image: "https://linktoimage3.com",
  },
  {
    id: 4,
    name: "Sản phẩm 4",
    price: "400.000 VND",
    image: "https://linktoimage4.com",
  },
  {
    id: 5,
    name: "Sản phẩm 5",
    price: "500.000 VND",
    image: "https://linktoimage5.com",
  },
  {
    id: 6,
    name: "Sản phẩm 6",
    price: "600.000 VND",
    image: "https://linktoimage6.com",
  },
];
const itemsPerPage = 4;

const ProductDetails = () => {
  const { id } = useParams(); // Lấy tham số 'id' từ URL
  const [product, setProduct] = useState(null); // Trạng thái sản phẩm
  const [quantity, setQuantity] = useState(1); // Trạng thái số lượng sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi

  // ================== Product Information =================
  const productInfoRef = useRef(null); // Tham chiếu tới phần thông tin sản phẩm
  const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mở rộng phần giới thiệu

  const specificationsRef = useRef(null); // Tham chiếu tới phần thông số
  const evaluateRef = useRef(null); // Tham chiếu tới phần đánh giá
  const similarProductsRef = useRef(null); // Tham chiếu tới phần đánh giá

  // ================== Comments / Reviews =================

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  // "user" là đối tượng lưu trong localStorage chứa thông tin người dùng đăng nhập, bao gồm tên

  const [userRating, setUserRating] = useState(0); // Trạng thái đánh giá sao
  const [comment, setComment] = useState(""); // Trạng thái nội dung đánh giá
  const [reviews, setReviews] = useState([]); // Danh sách đánh giá

  const [showReplyForm, setShowReplyForm] = useState(false); // Trạng thái hiển thị form trả lời

  const [replyContent, setReplyContent] = useState(""); // Biến trạng thái để lưu nội dung của phản hồi, mặc định là chuỗi rỗng. `setReplyContent` dùng để cập nhật giá trị của `replyContent`.

  const [replyPhone, setReplyPhone] = useState("");
  // Biến trạng thái để lưu số điện thoại của người trả lời, mặc định là chuỗi rỗng. `setReplyPhone` dùng để cập nhật giá trị của `replyPhone`.

  const [showReplies, setShowReplies] = useState({}); //Trạng thái theo dõi những câu trả lời nào được mở rộng
  const [isLoggedIn, setIsLoggedIn] = useState(false); //Giả sử trạng thái đăng nhập được xử lý ở nơi khác
  // ==============================  model =========================
  const [selectedProvince, setSelectedProvince] = useState("");
  /**
   * Lưu trữ tỉnh/thành phố được chọn từ một danh sách tỉnh/thành phố.
   * Giá trị khởi tạo là chuỗi rỗng.setSelectedProvince: Hàm dùng để cập nhật giá trị của selectedProvince.
   */
  const [selectedCity, setSelectedCity] = useState("");
  /**
   * selectedCity: Lưu trữ thành phố được chọn từ một danh sách thành phố. Giá trị khởi tạo là chuỗi rỗng.
   * setSelectedCity: Hàm dùng để cập nhật giá trị của selectedCity.
   */

  const [productDetails, setProductDetails] = useState(null);
  /**
   * productDetails: Lưu trữ chi tiết của sản phẩm. Giá trị khởi tạo là null, có thể được cập nhật khi có dữ liệu sản phẩm.
   * setProductDetails: Hàm dùng để cập nhật giá trị của productDetails.
   */

  //  ================================= BẮT LỖI MODEL =====================================
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
  const toast = useToast(); // Khởi tạo useToast

  // ================== Xử lý việc gửi đánh giá =================

  const toggleReplies = (index) => {
    setShowReplies((prev) => ({
      ...prev,
      [index]: !prev[index], // Chuyển đổi chế độ hiển thị của các câu trả lời
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn trang web tải lại

    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    const review = {
      name: loggedInUser ? loggedInUser.name : "Anonymous", // Sử dụng tên người dùng hoặc "Anonymous" nếu chưa đăng nhập
      rating: userRating, // Đánh giá của người dùng
      comment, // Nhận xét của người đánh giá
      likes: 0, // Số lượt thích, khởi tạo là 0
      time: new Date().toLocaleString(), // Thêm thời gian phản hồi
      replies: [], // Danh sách phản hồi, khởi tạo là rỗng
    };

    setReviews([...reviews, review]);
    setUserRating(0); // Đặt lại đánh giá của người dùng
    setComment(""); // Đặt lại nhận xét
  };

  // ================== Xử lý chức năng trả lời =================

// Hàm hủy bỏ biểu mẫu trả lời
const cancelReply = (formKey) => {
  // Cập nhật trạng thái hiển thị của biểu mẫu trả lời
  setShowReplyForm((prev) => ({
    ...prev,
    [formKey]: false, // Ẩn biểu mẫu trả lời tương ứng với formKey
  }));
  // Xóa các trường biểu mẫu nếu cần (comment để nhắc bạn có thể thêm xử lý này nếu cần)
};

// Hàm xử lý khi nội dung trả lời thay đổi
const handleReplyContentChange = (e) => setReplyContent(e.target.value); // Cập nhật nội dung trả lời dựa vào giá trị input

// Hàm xử lý khi người dùng nhấn vào nút "like"
const handleLikeClick = (index) => {
  const updatedReviews = [...reviews]; // Tạo bản sao của mảng đánh giá hiện tại
  updatedReviews[index].likes = (updatedReviews[index].likes || 0) + 1; // Tăng số lượng "like" cho đánh giá tương ứng
  setReviews(updatedReviews); // Cập nhật lại trạng thái đánh giá
};

// Hàm hiển thị hoặc ẩn biểu mẫu trả lời
const toggleReplyForm = (reviewIndex, replyIndex = null) => {
  // Tạo formKey để xác định chính xác biểu mẫu trả lời
  const formKey = replyIndex !== null ? `${reviewIndex}-${replyIndex}` : reviewIndex;

  setShowReplyForm((prev) => ({
    ...prev,
    [formKey]: !prev[formKey], // Đảo ngược trạng thái hiển thị của biểu mẫu (hiện hoặc ẩn)
  }));
};

// Hàm xử lý khi người dùng gửi trả lời
const handleReplySubmit = (reviewIndex, replyIndex = null, e) => {
  e.preventDefault(); // Ngăn không cho trang reload khi form được submit

  if (!replyContent) { // Kiểm tra nếu nội dung trả lời trống
    alert("Vui lòng điền đầy đủ thông tin!"); // Hiển thị cảnh báo nếu không có nội dung
    return;
  }

  // Tạo đối tượng trả lời mới
  const newReply = {
    name: "Người dùng", // Tên người dùng (có thể lấy từ hệ thống đăng nhập)
    content: replyContent, // Nội dung trả lời
    time: new Date().toLocaleString(), // Thời gian hiện tại
    replies: [], // Mảng chứa các trả lời của câu trả lời này (nếu có)
  };

  const updatedReviews = [...reviews]; // Tạo bản sao của mảng đánh giá
  let targetReplies =
    replyIndex !== null
      ? updatedReviews[reviewIndex].replies[replyIndex].replies
      : updatedReviews[reviewIndex].replies; // Xác định vị trí của trả lời trong mảng

  targetReplies.push(newReply); // Thêm trả lời mới vào mảng
  setReviews(updatedReviews); // Cập nhật lại trạng thái đánh giá
  setReplyContent(""); // Xóa nội dung trả lời sau khi gửi

  // Ẩn biểu mẫu trả lời sau khi gửi thành công
  setShowReplyForm((prev) => ({
    ...prev,
    [`${reviewIndex}-${replyIndex}`]: false,
  }));
};

  // ================== Chức năng cuộn =================
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

  // ================== Lấy dữ liệu sản phẩm =================
  useEffect(() => {
    // Hàm bất đồng bộ để lấy dữ liệu sản phẩm
    const fetchProduct = async () => {
      try {
        // Gửi yêu cầu GET đến API để lấy dữ liệu sản phẩm
        const response = await axios.get(`${BASE_URL}/api/products/${id}`);
        // Cập nhật trạng thái sản phẩm với dữ liệu nhận được
        setProduct(response.data);
      } catch (error) {
        // Cập nhật trạng thái lỗi nếu có lỗi xảy ra
        setError("Lỗi khi lấy dữ liệu sản phẩm");
      } finally {
        // Đặt trạng thái loading thành false khi hoàn tất việc lấy dữ liệu
        setLoading(false);
      }
    };

    // Gọi hàm fetchProduct để lấy dữ liệu sản phẩm
    fetchProduct();
  }, [id]); // Chạy lại hiệu ứng khi giá trị của `id` thay đổi

  // ================== Sản phẩm tương tự =================
  const [currentPage, setCurrentPage] = useState(0); // Trạng thái lưu trang hiện tại
  const totalPages = Math.ceil(products.length / itemsPerPage); // Tổng số trang

  const handleNext = () => {
    // Xử lý khi nhấn nút "Tiếp theo"
    setCurrentPage(
      (prevIndex) => (prevIndex === totalPages - 1 ? 0 : prevIndex + 1) // Nếu đang ở trang cuối cùng thì quay lại trang đầu, ngược lại thì chuyển sang trang tiếp theo
    );
  };

  const handlePrev = () => {
    // Xử lý khi nhấn nút "Trước đó"
    setCurrentPage(
      (prevIndex) => (prevIndex === 0 ? totalPages - 1 : prevIndex - 1) // Nếu đang ở trang đầu tiên thì chuyển đến trang cuối cùng, ngược lại thì chuyển về trang trước đó
    );
  };

  const startIndex = currentPage * itemsPerPage; // Tính chỉ số bắt đầu của sản phẩm hiện tại trên trang
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage); // Lọc danh sách sản phẩm để chỉ lấy các sản phẩm thuộc trang hiện tại

  // ================== Định dạng giá =================
  const formatPrice = (price) => {
    // Định dạng giá thành tiền tệ theo định dạng Việt Nam (VND)
    return new Intl.NumberFormat("vi-VN", {
      style: "currency", // Định dạng kiểu tiền tệ
      currency: "VND", // Đơn vị tiền tệ là VND (Việt Nam Đồng)
    }).format(price); // Định dạng giá và trả về dưới dạng chuỗi
  };

  // ================== Kiểm soát số lượng =================
  const increaseQuantity = () => {
    // Tăng số lượng lên 1
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    // Giảm số lượng xuống 1, nhưng không nhỏ hơn 1
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  // ================== Thêm vào giỏ hàng =================
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Function to add the product to the cart
  const addToCart = () => {
    if (product) {
      // Create an object containing the product details
      const details = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        quantity: quantity,
      };

      // Get the cart from localStorage, or initialize an empty array if it doesn't exist
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if the product is already in the cart
      const existingProductIndex = cart.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex !== -1) {
        // If the product exists, update its quantity
        cart[existingProductIndex].quantity += quantity;
      } else {
        // If the product doesn't exist, add it to the cart
        cart.push(details);
      }

      // Update the cart in localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  // Function to open the modal with the product details
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
      setProductDetails(details); // Set product details for the modal
      onOpen(); // Open the modal
    }
  };

  // ================== Tính toán Xếp hạng trung bình =================
  const averageRating =
    reviews.length > 0
      ? // Tính tổng các đánh giá và chia cho số lượng đánh giá để có được điểm trung bình
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0; // Nếu không có đánh giá nào, điểm trung bình sẽ là 0

  // ================== Xử lý Đánh giá của Người dùng Nhấp chuột =================
  const handleUserRatingClick = (index) => {
    // Khi người dùng nhấp vào một mức đánh giá, cập nhật trạng thái đánh giá của người dùng
    setUserRating(index + 1);
  };

  // ================== Trạng thái tải và lỗi =================
  if (loading) {
    // Hiển thị thông báo "Loading data..." khi dữ liệu đang được tải
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    // Hiển thị thông báo lỗi khi có lỗi xảy ra
    return <div className="error">{error}</div>;
  }

  if (!product) {
    // Hiển thị thông báo "Product not found" khi không tìm thấy sản phẩm
    return <div>Không tìm thấy sản phẩm</div>;
  }

  // ================== Cài đặt thanh trượt =================
  const settings = {
    dots: true, // Hiển thị các dấu chấm điều hướng dưới slider
    infinite: true, // Cho phép cuộn vô hạn (khi đến slide cuối cùng, cuộn lại slide đầu tiên)
    speed: 500, // Tốc độ chuyển đổi giữa các slide (tính bằng mili giây)
    slidesToShow: 1, // Số lượng slide hiển thị cùng lúc
    slidesToScroll: 1, // Số lượng slide cuộn mỗi khi chuyển đổi
  };

  // ============================= model ======================

  const provinces = [
    {
      name: "Hà Nội",
      cities: ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Tây Hồ"],
    },
    {
      name: "TP Hồ Chí Minh",
      cities: ["Quận 1", "Quận 2", "Quận 3"],
    },
    {
      name: "Đà Nẵng",
      cities: ["Quận Hải Châu", "Quận Thanh Khê", "Quận Ngũ Hành Sơn"],
    },
    // Thêm các tỉnh và thành phố khác nếu cần
  ];

  const handleProvinceChange = (e) => {
    // Xử lý khi người dùng chọn tỉnh/thành phố
    setSelectedProvince(e.target.value);
    setSelectedCity(""); // Đặt lại lựa chọn thành phố khi tỉnh/thành phố thay đổi
  };

  const handleCityChange = (e) => {
    // Xử lý khi người dùng chọn thành phố
    setSelectedCity(e.target.value);
  };

  // ===========================
  /** ==================================== BẮT LỖI FORM MODEL ==================================================== */

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
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

  const handleSubmitModel = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Xử lý khi form được gửi thành công
      console.log("Form submitted successfully", formData);

      // Hiển thị thông báo thành công
      toast({
        title: "Đặt hàng thành công.",
        description: "Đơn hàng của bạn đã được gửi thành công.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
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
    }
  };

  /**============================================================= */

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

          <div class="brand-menu">
            <ul>
              <li>
                <a href="/dong-ho-nam.aspx" title="Đồng hồ Nam">
                  Đồng hồ Nam
                </a>
              </li>
              <li>
                <a href="/dong-ho-nu.aspx" title="Đồng hồ Nữ">
                  Đồng hồ Nữ
                </a>
              </li>
              <li>
                <a href="#" target="_blank" title="Sản phẩm mới">
                  Sản phẩm mới
                </a>
              </li>
              <li>
                <a href="#" target="_blank" title="Bài viết">
                  Bài viết
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr />
        {/* Product Images and Information */}
        <div className="product-detail-container">
          {/* Product Images */}
          <div className="product-image-section">
            {product.images &&
            Array.isArray(product.images) &&
            product.images.length > 0 ? (
              <div className="image-slider-container">
                {/* Thumbnail Slider */}
                <div className="thumbnail-slider">
                  {product.images.map((img, index) => (
                    <div key={index} className="thumbnail">
                      <img
                        src={`${BASE_URL}/uploads/products/${img}`}
                        alt={`Thumbnail ${index}`}
                      />
                    </div>
                  ))}
                </div>
                {/* Main Slider */}
                <Slider {...settings} className="product-image-slider">
                  {product.images.map((img, index) => (
                    <div key={index}>
                      <img
                        src={`${BASE_URL}/uploads/products/${img}`}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              // Single Image Display
              <img
                src={`${BASE_URL}/uploads/products/${product.image}`}
                alt={product.name}
                className="product-image"
              />
            )}
          </div>

          {/* Product Information */}
          <div className="product-info-section">
            <h1 className="product-name">{product.name}</h1>
            {/* Aggregate Rating */}
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
            {/* Price and Quantity */}
            <div className="flex_item">
              <p className="product-price">{formatPrice(product.price)}</p>
              {/*  <div className="quantity_controls">
                <label className="title_quantity">Quantity:</label>
                <div className="quantity-wrapper">
                  <input
                    className="in_number ssda"
                    type="number"
                    value={quantity}
                    readOnly
                  />
                  <div className="quantity_increase_decrease">
                   
                    <button
                      onClick={increaseQuantity}
                      className="button_quantity"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                   
                    <button
                      onClick={decreaseQuantity}
                      className="button_quantity"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                  </div>
                </div>
              </div> */}
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

            {/* Cam kết */}
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

        {/* Quick Navigation Buttons */}
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

        {/* Introduction Section */}
        <div ref={productInfoRef} className="introduction-section">
          <h2>GIỚI THỆU</h2>

          <div
            className={`introduction-content ${
              isExpanded ? "expanded" : "collapsed"
            }`}
          >
            {/* Product introduction content */}
            {/* Replace with actual product details */}
            <p>
              {/* Your introduction text here */}
              Citizen pays tribute to Disney's animated film "The Little
              Mermaid" with a special new Princess Ariel box set. Complete with
              a mesmerizing watch and a special shell-shaped pin, the rose gold
              stainless steel case and green crystal accents add dimension,
              reminiscent of Ariel's underwater treasures. Powered by Eco-Drive
              technology, the watch never needs a battery.
            </p>
          </div>
          {/* Toggle Button */}
          <div className="toggleExpand-button">
            <button onClick={toggleExpand} className="toggle-button">
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
        </div>

        {/* THÔNG SỐ Section */}
        <div ref={specificationsRef} className="bg-gray">
          <div className="m-product-specification">
            <div className="m-product-specification__list">
              <div className="m-product-specification__name_full">
                <h2>THÔNG SỐ</h2>
              </div>

              {/* Product Specifications */}
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">
                  Thương hiệu
                </span>
                <span className="m-product-specification__name">
                  : {product.brand || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">SKU</span>
                <span className="m-product-specification__name">
                  : {product.sku || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">Loại máy</span>
                <span className="m-product-specification__name">
                  : {product.type || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">độ dầy</span>
                <span className="m-product-specification__name">
                  : {product.diameter || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">
                  Chất liệu dây đeo
                </span>
                <span className="m-product-specification__name">
                  : {product.bandMaterial || "N/A"}
                </span>
              </div>
              <div className="m-product-specification__item">
                <span className="m-product-specification__label">
                  Chống nước
                </span>
                <span className="m-product-specification__name">
                  : {product.waterResistance || "N/A"}
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
                  : {product.color || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ĐÁNH GIÁ Section */}
        <div className="reviews-section">
          <h3 className="comment_title">ĐÁNH GIÁ</h3>
          <div className="comment-box">
            {/* Review Submission Form */}
            {/* {isLoggedIn ? ( */}
            {/* // Nếu đã đăng nhập thì cho phép bình luận */}
            <form onSubmit={handleSubmit} className="comment-form">
              {/* Star Rating Input */}
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
              {/* Name and Phone Inputs */}

              {/* Comment Textarea */}
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
            {/* ) : (
              // Nếu chưa đăng nhập thì hiển thị thông báo yêu cầu đăng nhập
              <p>
                Vui lòng{" "}
                <a href="/signin" style={{ color: "red" }}>
                  đăng nhập
                </a>{" "}
                để bình luận.
              </p>
            )} */}

            <hr />

            {/* List of Reviews */}
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

                      {/* Nút thu gọn/mở rộng phần replies */}
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

        {/* SẢN PHẨM TƯƠNG TỰ Section */}
        <div ref={similarProductsRef} className="container-Similar-product">
          <div className="related-products big-title">
            <h2>SẢN PHẨM TƯƠNG TỰ</h2>
          </div>
          <div className="carousel-container">
            <div className="carousel-wrapper">
              {currentProducts.map((product) => (
                <div className="carousel-item" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <p>{product.id}</p>
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                </div>
              ))}
            </div>
            <button className="carousel-button prev" onClick={handlePrev}>
              ❮
            </button>
            <button className="carousel-button next" onClick={handleNext}>
              ❯
            </button>
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent maxW="1200px">
            <ModalHeader>Thông tin giao hàng</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box mx="auto" p={4}>
                <Flex direction={{ base: "column", md: "row" }} gap={6}>
                  {/* Form Section */}
                  <Box flex={7}>
                    <form onSubmit={handleSubmitModel}>
                      <FormControl mb={3} isInvalid={errors.name}>
                        <FormLabel htmlFor="name">Tên khách hàng</FormLabel>
                        <Input
                          className="custom-input"
                          id="name"
                          placeholder="Nhập tên khách hàng"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {errors.name && (
                          <FormErrorMessage>{errors.name}</FormErrorMessage>
                        )}
                      </FormControl>

                      <Flex mb={3} gap={4}>
                        <FormControl mb={3} flex={1} isInvalid={errors.email}>
                          <FormLabel htmlFor="email">Địa chỉ email</FormLabel>
                          <Input
                            className="custom-input"
                            id="email"
                            placeholder="Địa chỉ email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                          {errors.email && (
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                          )}
                        </FormControl>

                        <FormControl mb={3} flex={1} isInvalid={errors.phone}>
                          <FormLabel htmlFor="phone">Số điện thoại</FormLabel>
                          <Input
                            className="custom-input"
                            type="number"
                            id="phone"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                          {errors.phone && (
                            <FormErrorMessage>{errors.phone}</FormErrorMessage>
                          )}
                        </FormControl>
                      </Flex>

                      {/* Province and City Section */}
                      <Flex mb={3} gap={4}>
                        <FormControl flex={1} isInvalid={errors.province}>
                          <FormLabel htmlFor="province">Tỉnh</FormLabel>
                          <Select
                            className="custom-input"
                            id="province"
                            value={formData.province}
                            onChange={handleChange}
                          >
                            <option value="">Chọn Tỉnh</option>
                            {provinces.map((province, index) => (
                              <option key={index} value={province.name}>
                                {province.name}
                              </option>
                            ))}
                          </Select>
                          {errors.province && (
                            <FormErrorMessage>
                              {errors.province}
                            </FormErrorMessage>
                          )}
                        </FormControl>

                        <FormControl flex={1} isInvalid={errors.city}>
                          <FormLabel htmlFor="city">Thành phố</FormLabel>
                          <Select
                            className="custom-input"
                            id="city"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={!formData.province}
                          >
                            <option value="">Chọn Thành phố</option>
                            {formData.province &&
                              provinces
                                .find(
                                  (province) =>
                                    province.name === formData.province
                                )
                                ?.cities.map((city, index) => (
                                  <option key={index} value={city}>
                                    {city}
                                  </option>
                                ))}
                          </Select>
                          {errors.city && (
                            <FormErrorMessage>{errors.city}</FormErrorMessage>
                          )}
                        </FormControl>
                      </Flex>

                      <FormControl mb={3} isInvalid={errors.address}>
                        <FormLabel htmlFor="address">
                          Địa chỉ nhận hàng
                        </FormLabel>
                        <Input
                          className="custom-input"
                          id="address"
                          placeholder="Nhập địa chỉ nhận hàng"
                          value={formData.address}
                          onChange={handleChange}
                        />
                        {errors.address && (
                          <FormErrorMessage>{errors.address}</FormErrorMessage>
                        )}
                      </FormControl>

                      <FormControl mb={3}>
                        <FormLabel htmlFor="note">Ghi chú</FormLabel>
                        <Textarea
                          className="custom-input"
                          id="note"
                          rows={3}
                          placeholder="Nhập ghi chú"
                          value={formData.note}
                          onChange={handleChange}
                        />
                      </FormControl>

                      <FormControl mb={3} isInvalid={errors.paymentMethod}>
                        <FormLabel htmlFor="paymentMethod">
                          Phương thức thanh toán
                        </FormLabel>
                        <Select
                          className="custom-input"
                          id="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                        >
                          <option value="COD">
                            Thanh toán khi giao hàng (COD)
                          </option>
                          <option value="bankTransfer">Chuyển khoản</option>
                        </Select>

                        {errors.paymentMethod && (
                          <FormErrorMessage>
                            {errors.paymentMethod}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                      <Button
                        type="submit"
                        colorScheme="b29c6e"
                        className="button_order"
                        onClick={addToCart}
                      >
                        Đặt hàng
                      </Button>
                    </form>
                  </Box>

                  {/* Product Summary Section */}
                  {productDetails && (
                    <Box flex={5}>
                      <div
                        style={{
                          background: "#e4cc972e",
                          marginBottom: "40px",
                          padding: "20px",
                          borderRadius: "6px",
                        }}
                      >
                        <divcardbody>
                          <Flex
                            justifyContent={"space-between"}
                            columnGap={"30px"}
                          >
                            <Img
                              src={productDetails.image}
                              alt={productDetails.name}
                              maxWidth={"80px"}
                              width={"100%"}
                            />
                            <Box width={"78%"}>
                              <Heading as="h5" size="sm" mb={2}>
                                {productDetails.name}
                              </Heading>
                              <Text>MSP: {productDetails.id}</Text>
                              <Flex
                                justify="space-between"
                                align="center"
                                my={4}
                              >
                                <Flex align="center" gap={1}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    // onClick={() =>
                                    //   setQuantity(
                                    //     quantity > 1 ? quantity - 1 : 1
                                    //   )
                                    // }

                                    onClick={decreaseQuantity}
                                  >
                                    -
                                  </Button>
                                  <Input
                                    colorScheme="gray"
                                    px={2}
                                    value={quantity}
                                    readOnly
                                    textAlign="center"
                                    width="60px"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    // onClick={() => setQuantity(quantity + 1)}
                                    onClick={increaseQuantity}
                                  >
                                    +
                                  </Button>
                                </Flex>
                                <Text fontWeight="bold">
                                  {formatPrice(product.price)}
                                </Text>
                              </Flex>
                            </Box>
                          </Flex>

                          <Divider borderColor={"black"} />
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Text my={3}>Vận chuyển:</Text>
                            <Text my={3}>Miễn phí</Text>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Heading as="h5" size="sm">
                              Tổng cộng:
                            </Heading>
                            <Heading as="h5" size="sm">
                              {formatPrice(productDetails.price * quantity)}
                            </Heading>
                          </Box>
                        </divcardbody>
                      </div>
                    </Box>
                  )}
                </Flex>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Đóng
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default ProductDetails;
