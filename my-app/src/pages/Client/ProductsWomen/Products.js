/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Heading,
  Input,
  Divider,
  Text,
  Img,
  Flex,
  FormErrorMessage,
  Select,
  FormLabel,
  FormControl,
  Textarea,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import "./Products.css";
import { HeartIcon } from "../../../components/icon/icon";
import { color } from "framer-motion";
import CustomCheckbox from "./component/CustomCheckbox";
import Slideshow from "./component/Slideshow/Slideshow";

const BASE_URL = "http://localhost:3000"; // Adjust this if needed

// ========================================= XỔ DANH DÁCH CỦA TỪNG MỤC ================================================
// Component FilterItem nhận vào 2 props: title và children.
// title: Tiêu đề của bộ lọc (ví dụ: "Thương hiệu", "Loại máy").
// children: Các nội dung bên trong bộ lọc, ví dụ như danh sách các lựa chọn.

const FilterItem = ({ title, children, filters }) => {
  // Khai báo state isOpen để kiểm soát việc mở hoặc đóng danh sách bộ lọc.
  // Mặc định state là false (đóng).
  const [isOpen, setIsOpen] = useState(false);

  const filterRef = useRef(null);

  const [selectedFilters, setSelectedFilters] = useState([]);

  // Hàm toggleFilter dùng để thay đổi trạng thái isOpen.
  // Khi người dùng click vào tiêu đề bộ lọc, hàm này sẽ được gọi,
  // đổi trạng thái giữa mở và đóng (true/false).
  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (filter) => {
    // Kiểm tra xem filter đã được chọn chưa
    if (selectedFilters.includes(filter)) {
      // Nếu đã chọn, thì bỏ chọn
      setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    } else {
      // Nếu chưa chọn, thêm vào danh sách các filter đã chọn
      setSelectedFilters([...selectedFilters, filter]);
    }
  };
  useEffect(() => {
    const filterContent = filterRef.current;

    // Kiểm tra xem filterContent có tồn tại trước khi truy cập style
    if (filterContent) {
      if (isOpen) {
        // Khi mở, tính toán chiều cao thực tế của nội dung và áp dụng vào max-height
        filterContent.style.maxHeight = `${filterContent.scrollHeight}px`;
      } else {
        // Khi đóng, đặt max-height về 0
        filterContent.style.maxHeight = "0";
      }
    }
  }, [isOpen]);

  return (
    <div className="filter-col">
      {/* Phần tiêu đề của bộ lọc. Khi người dùng nhấp vào, hàm toggleFilter sẽ được gọi. */}
      <div
        className={`uppercase filter-title ${isOpen ? "active" : ""}`}
        onClick={toggleFilter}
      >
        {title} {/* Hiển thị tiêu đề của bộ lọc */}
      </div>

      {/* Nếu isOpen là true, các tùy chọn của bộ lọc sẽ hiển thị (children). */}
      {isOpen && (
        <div ref={filterRef} className="filter-options">
          {/* Hiển thị nội dung con (children) được truyền từ component cha */}
          {children}

          {/* Danh sách các bộ lọc được map từ mảng filters */}
          <ul class="ul-2columns">
            {filters.map((filter) => (
              // Mỗi bộ lọc sẽ tạo ra một thẻ li với key duy nhất là filter.id
              <li key={filter.id}>
                <label>
                  {/* Sử dụng CustomCheckbox component */}
                  <CustomCheckbox
                    key={filter.id} // Đặt key là filter.id để đảm bảo mỗi phần tử trong danh sách là duy nhất
                    id={`checkbox-${filter.id}`} // ID duy nhất cho checkbox
                    label={filter.name} // Tên nhãn (label) của bộ lọc, sẽ được hiển thị bên cạnh checkbox
                    checked={selectedFilters.includes(filter.name)} // Kiểm tra xem bộ lọc hiện tại có nằm trong danh sách các filter đã chọn không
                    onChange={(isChecked) =>
                      handleFilterChange(filter.name, isChecked)
                    } // Khi trạng thái checkbox thay đổi, gọi hàm handleFilterChange để xử lý
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// =========================================================================================
const ProductsWomen = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
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

  const [visibleProducts, setVisibleProducts] = useState(12); // Số lượng sản phẩm hiển thị ban đầu
  const [selectedProduct, setSelectedProduct] = useState(null); // Updated state

  useEffect(() => {
    // Hàm fetch sản phẩm từ API
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products`);
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    // Hàm xử lý cuộn trang
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        loadMoreProducts(); // Tải thêm sản phẩm khi cuộn đến gần cuối trang
      }
    };

    // Gọi API để lấy sản phẩm
    fetchProducts();

    // Lắng nghe sự kiện cuộn trang
    window.addEventListener("scroll", handleScroll);

    // Xóa sự kiện cuộn khi component bị unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

    const handleOpenModal = (product) => {
      setSelectedProduct(product);
      setIsOpen(true);
    };
    const handleCloseModal = () => setIsOpen(false);
  const [likedProducts, setLikedProducts] = useState([]);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);
  const increaseQuantity = () => setQuantity(quantity + 1);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmitModel = (e) => {
    e.preventDefault();
    // Form validation and submit logic
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // ============================================================================
  // Hàm xử lý khi người dùng nhấn nút "Tải thêm"
  const loadMoreProducts = () => {
    setVisibleProducts((prevVisible) => prevVisible + 12); // Tăng số lượng sản phẩm hiển thị thêm 6 sản phẩm
  };
  // ==========================================================================
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);

  // Hàm để mở offcanvas
  const openOffcanvas = () => {
    setIsOffcanvasVisible(true);
  };

  // ============================================= thích sản phẩm ============================
  const toggleLike = (productId) => {
    setLikedProducts(
      (prevLiked) =>
        prevLiked.includes(productId)
          ? prevLiked.filter((id) => id !== productId) // Unlike
          : [...prevLiked, productId] // Like
    );
  };

  // ======================================thương hiệu==========================================
  const brands = [
    { id: 465, name: "Baume & Mercier", dataQuery: "thuong_hieu" },
    { id: 507, name: "Breguet", dataQuery: "thuong_hieu" },
    { id: 417, name: "Bulova", dataQuery: "thuong_hieu" },
    { id: 483, name: "Bulova Accutron", dataQuery: "thuong_hieu" },
    { id: 490, name: "Bulova Accu Swiss", dataQuery: "thuong_hieu" },
    { id: 517, name: "BVLGARI", dataQuery: "thuong_hieu" },
    { id: 468, name: "Burberry", dataQuery: "thuong_hieu" },
    { id: 478, name: "Calvin Klein", dataQuery: "thuong_hieu" },
    { id: 503, name: "CARTIER", dataQuery: "thuong_hieu" },
    { id: 487, name: "Chanel", dataQuery: "thuong_hieu" },
    { id: 454, name: "Chopard", dataQuery: "thuong_hieu" },
    { id: 504, name: "Christian Dior", dataQuery: "thuong_hieu" },
    { id: 419, name: "Citizen", dataQuery: "thuong_hieu" },
    { id: 494, name: "FRANCK MULLER", dataQuery: "thuong_hieu" },
    { id: 464, name: "Fendi", dataQuery: "thuong_hieu" },
    { id: 515, name: "Frederique Constant", dataQuery: "thuong_hieu" },
    { id: 422, name: "Fossil", dataQuery: "thuong_hieu" },
    { id: 447, name: "Gucci", dataQuery: "thuong_hieu" },
    { id: 424, name: "Guess", dataQuery: "thuong_hieu" },
    { id: 493, name: "Guess GC", dataQuery: "thuong_hieu" },
    { id: 453, name: "Hamilton", dataQuery: "thuong_hieu" },
    { id: 481, name: "Hermes", dataQuery: "thuong_hieu" },
    { id: 509, name: "Hublot", dataQuery: "thuong_hieu" },
    { id: 477, name: "IWC", dataQuery: "thuong_hieu" },
    { id: 512, name: "Jaeger LeCoultre", dataQuery: "thuong_hieu" },
    { id: 459, name: "Lacoste", dataQuery: "thuong_hieu" },
    { id: 451, name: "Longines", dataQuery: "thuong_hieu" },
    { id: 426, name: "Michael Kors", dataQuery: "thuong_hieu" },
    { id: 472, name: "Michele", dataQuery: "thuong_hieu" },
    { id: 516, name: "MIDO", dataQuery: "thuong_hieu" },
    { id: 510, name: "Montblanc", dataQuery: "thuong_hieu" },
    { id: 421, name: "Movado", dataQuery: "thuong_hieu" },
    { id: 467, name: "Omega", dataQuery: "thuong_hieu" },
    { id: 506, name: "Panerai", dataQuery: "thuong_hieu" },
    { id: 489, name: "Patek Philippe", dataQuery: "thuong_hieu" },
    { id: 508, name: "Piaget", dataQuery: "thuong_hieu" },
    { id: 452, name: "Salvatore Ferragamo", dataQuery: "thuong_hieu" },
    { id: 434, name: "Seiko", dataQuery: "thuong_hieu" },
    { id: 429, name: "Stuhrling Original", dataQuery: "thuong_hieu" },
    { id: 428, name: "Swatch", dataQuery: "thuong_hieu" },
    { id: 484, name: "Swarovski", dataQuery: "thuong_hieu" },
    { id: 463, name: "Rado", dataQuery: "thuong_hieu" },
    { id: 462, name: "Raymond Weil", dataQuery: "thuong_hieu" },
    { id: 449, name: "Tag Heuer", dataQuery: "thuong_hieu" },
    { id: 476, name: "Tissot", dataQuery: "thuong_hieu" },
    { id: 431, name: "Tommy Hilfiger", dataQuery: "thuong_hieu" },
    { id: 519, name: "Vacheron Constantin", dataQuery: "thuong_hieu" },
    { id: 446, name: "Versace", dataQuery: "thuong_hieu" },
    { id: 470, name: "Versus by Versace", dataQuery: "thuong_hieu" },
    { id: 456, name: "Victorinox swiss army", dataQuery: "thuong_hieu" },
    { id: 479, name: "Zenith", dataQuery: "thuong_hieu" },
  ];
  const loaiMayArray = [
    { id: 2162, name: "Automatic" },
    { id: 2163, name: "Quartz" },
    { id: 2164, name: "Eco-Driver" },
    { id: 2165, name: "Solar" },
    { id: 2166, name: "Smart Watch" },
    { id: 3303, name: "Tourbillion" },
  ];
  const dayArray = [
    { id: 404, name: "Dây Kim Loại" },
    { id: 405, name: "Dây Da" },
    { id: 406, name: "Dây Đá Ceramic" },
    { id: 407, name: "Plastic" },
    { id: 408, name: "Dây Cao Su" },
    { id: 409, name: "Vải" },
    { id: 444, name: "Silicone" },
    { id: 513, name: "Vàng Nguyên Khối" },
    { id: 518, name: "Dây Satin" },
    { id: 526, name: "Dây Sapphire" },
    { id: 5423, name: "Titanium" },
  ];

  const mauSacArray = [
    { id: 2172, name: "Vàng hổ phách" },
    { id: 2173, name: "Kem nhạt" },
    { id: 2174, name: "Đen" },
    { id: 2175, name: "Xanh" },
    { id: 2176, name: "Đồng cổ" },
    { id: 2177, name: "Nâu" },
    { id: 2178, name: "Đỏ tía" },
    { id: 2179, name: "Rượu vang" },
    { id: 2180, name: "Sô cô la" },
    { id: 2181, name: "Đồng" },
    { id: 2182, name: "Kem" },
    { id: 2183, name: "Crystal" },
    { id: 2184, name: "Số điện tử" },
    { id: 2185, name: "Xanh lá cây" },
    { id: 2186, name: "Xám" },
    { id: 2187, name: "Ngà" },
    { id: 2188, name: "Khảm ngọc trai" },
    { id: 2189, name: "Cam" },
    { id: 2190, name: "Hồng" },
    { id: 2191, name: "Tím" },
    { id: 2192, name: "Cầu vồng" },
    { id: 2193, name: "Đỏ" },
    { id: 2194, name: "Rodium" },
    { id: 2195, name: "Hồng đậm" },
    { id: 2196, name: "Vàng hồng" },
    { id: 2197, name: "Bạc" },
    { id: 2198, name: "Sundust" },
    { id: 2199, name: "Xám nâu" },
    { id: 2200, name: "Xanh ngọc lam" },
    { id: 2201, name: "Trắng" },
    { id: 2202, name: "Vàng" },
    { id: 2203, name: "Yellow gold" },
    { id: 2204, name: "Đen kim loại" },
    { id: 2205, name: "Tortoise" },
    { id: 5308, name: "Champagne" },
    { id: 5327, name: "Nude (Beige)" },
    { id: 5337, name: "Gunmetal" },
    { id: 5342, name: "Iridescent" },
    { id: 5363, name: "Multicolour" },
    { id: 5380, name: "2 Tông màu" },
    { id: 5397, name: "Trong suốt" },
    { id: 5421, name: "Olive" },
    { id: 2172, name: "Vàng hổ phách" },
    { id: 2173, name: "Kem nhạt" },
    { id: 2174, name: "Đen" },
    { id: 2175, name: "Xanh" },
    { id: 2176, name: "Đồng cổ" },
    { id: 2177, name: "Nâu" },
    { id: 2178, name: "Đỏ tía" },
    { id: 2179, name: "Rượu vang" },
    { id: 2180, name: "Sô cô la" },
    { id: 2181, name: "Đồng" },
    { id: 2182, name: "Kem" },
    { id: 2183, name: "Crystal" },
    { id: 2184, name: "Số điện tử" },
    { id: 2185, name: "Xanh lá cây" },
    { id: 2186, name: "Xám" },
    { id: 2187, name: "Ngà" },
    { id: 2188, name: "Khảm ngọc trai" },
    { id: 2189, name: "Cam" },
    { id: 2190, name: "Hồng" },
    { id: 2191, name: "Tím" },
    { id: 2192, name: "Cầu vồng" },
    { id: 2193, name: "Đỏ" },
    { id: 2194, name: "Rodium" },
    { id: 2195, name: "Hồng đậm" },
    { id: 2196, name: "Vàng hồng" },
    { id: 2197, name: "Bạc" },
    { id: 2198, name: "Sundust" },
    { id: 2199, name: "Xám nâu" },
    { id: 2200, name: "Xanh ngọc lam" },
    { id: 2201, name: "Trắng" },
    { id: 2202, name: "Vàng" },
    { id: 2203, name: "Yellow gold" },
    { id: 2204, name: "Đen kim loại" },
    { id: 2205, name: "Tortoise" },
    { id: 5308, name: "Champagne" },
    { id: 5327, name: "Nude (Beige)" },
    { id: 5337, name: "Gunmetal" },
    { id: 5342, name: "Iridescent" },
    { id: 5363, name: "Multicolour" },
    { id: 5380, name: "2 Tông màu" },
    { id: 5397, name: "Trong suốt" },
    { id: 5421, name: "Olive" },
  ];

  const duongKinhArray = [
    { id: 1, name: "< 20mm" },
    { id: 20, name: "20mm" },
    { id: 21, name: "21mm" },
    { id: 22, name: "22mm" },
    { id: 23, name: "23mm" },
    { id: 24, name: "24mm" },
    { id: 25, name: "25mm" },
    { id: 26, name: "26mm" },
    { id: 27, name: "27mm" },
    { id: 28, name: "28mm" },
    { id: 29, name: "29mm" },
    { id: 30, name: "30mm" },
    { id: 31, name: "31mm" },
    { id: 32, name: "32mm" },
    { id: 33, name: "33mm" },
    { id: 34, name: "34mm" },
    { id: 35, name: "35mm" },
    { id: 36, name: "36mm" },
    { id: 37, name: "37mm" },
    { id: 38, name: "38mm" },
    { id: 38.5, name: "38.5mm" },
    { id: 39, name: "39mm" },
    { id: 39.5, name: "39.5mm" },
    { id: 40, name: "40mm" },
    { id: 40.5, name: "40.5mm" },
    { id: 41, name: "41mm" },
    { id: 41.5, name: "41.5mm" },
    { id: 42, name: "42mm" },
    { id: 42.5, name: "42.5mm" },
    { id: 43, name: "43mm" },
    { id: 44, name: "44mm" },
    { id: 45, name: "45mm" },
    { id: 46, name: "46mm" },
    { id: 47, name: "47mm" },
    { id: 99, name: "> 47mm" },
    { id: 1, name: "< 20mm" },
    { id: 20, name: "20mm" },
    { id: 21, name: "21mm" },
    { id: 22, name: "22mm" },
    { id: 23, name: "23mm" },
    { id: 24, name: "24mm" },
    { id: 25, name: "25mm" },
    { id: 26, name: "26mm" },
    { id: 27, name: "27mm" },
    { id: 28, name: "28mm" },
    { id: 29, name: "29mm" },
    { id: 30, name: "30mm" },
    { id: 31, name: "31mm" },
    { id: 32, name: "32mm" },
    { id: 33, name: "33mm" },
    { id: 34, name: "34mm" },
    { id: 35, name: "35mm" },
    { id: 36, name: "36mm" },
    { id: 37, name: "37mm" },
    { id: 38, name: "38mm" },
    { id: 38.5, name: "38.5mm" },
    { id: 39, name: "39mm" },
    { id: 39.5, name: "39.5mm" },
    { id: 40, name: "40mm" },
    { id: 40.5, name: "40.5mm" },
    { id: 41, name: "41mm" },
    { id: 41.5, name: "41.5mm" },
    { id: 42, name: "42mm" },
    { id: 42.5, name: "42.5mm" },
    { id: 43, name: "43mm" },
    { id: 44, name: "44mm" },
    { id: 45, name: "45mm" },
    { id: 46, name: "46mm" },
    { id: 47, name: "47mm" },
    { id: 99, name: "> 47mm" },
  ];
  const styleArray = [
    { id: 3307, name: "Bạch Kim" },
    { id: 3304, name: "Kim Cương" },
    { id: 2167, name: "18K" },
    { id: 4272, name: "Vàng Everose 18 ct" },
    { id: 4273, name: "Vàng vàng 18k" },
    { id: 4274, name: "Vàng Sedna™ 18K" },
    { id: 4275, name: "Vàng Moonshine™ 18K" },
    { id: 4276, name: "Vàng Trắng 18 ct" },
    { id: 4277, name: "Vàng Hồng 18k" },
    { id: 4278, name: "Vàng King 18K" },
    { id: 4279, name: "Vàng Đỏ 18K" },
    { id: 4280, name: "Vàng 18 Carat" },
    { id: 4281, name: "Vàng Hồng 18kt" },
    { id: 4282, name: "Vàng Hồng 18K" },
    { id: 4283, name: "Vàng Trắng 18k" },
    { id: 4284, name: "Vàng Hồng 18 karat" },
    { id: 4285, name: "Vàng 5N 18 ct" },
    { id: 4286, name: "Vàng Beige 18K" },
    { id: 2168, name: "Vàng hổ phách" },
    { id: 3311, name: "Vàng nguyên chất" },
    { id: 3316, name: "Topaz" },
    { id: 3315, name: "Topazes" },
    { id: 3309, name: "Ngọc Đỏ" },
    { id: 3310, name: "Saphire" },
    { id: 3313, name: "Pha Lê Swarovski" },
    { id: 3314, name: "Titan" },
    { id: 2169, name: "Ngọc xanh lá cây" },
    { id: 2170, name: "Ngọc biển" },
    { id: 2171, name: "Gốm" },
    { id: 3312, name: "Đá spinel" },
    { id: 3306, name: "Ngọc xanh" },
    { id: 3317, name: "Zircon" },
    { id: 3305, name: "Zircon" },
    { id: 5274, name: "Crystal" },
    { id: 3308, name: "Cao su" },
    { id: 5287, name: "Khảm xà cừ" },
    { id: 3307, name: "Bạch Kim" },
    { id: 3304, name: "Kim Cương" },
    { id: 2167, name: "18K" },
    { id: 4272, name: "Vàng Everose 18 ct" },
    { id: 4273, name: "Vàng vàng 18k" },
    { id: 4274, name: "Vàng Sedna™ 18K" },
    { id: 4275, name: "Vàng Moonshine™ 18K" },
    { id: 4276, name: "Vàng Trắng 18 ct" },
    { id: 4277, name: "Vàng Hồng 18k" },
    { id: 4278, name: "Vàng King 18K" },
    { id: 4279, name: "Vàng Đỏ 18K" },
    { id: 4280, name: "Vàng 18 Carat" },
    { id: 4281, name: "Vàng Hồng 18kt" },
    { id: 4282, name: "Vàng Hồng 18K" },
    { id: 4283, name: "Vàng Trắng 18k" },
    { id: 4284, name: "Vàng Hồng 18 karat" },
    { id: 4285, name: "Vàng 5N 18 ct" },
    { id: 4286, name: "Vàng Beige 18K" },
    { id: 2168, name: "Vàng hổ phách" },
    { id: 3311, name: "Vàng nguyên chất" },
    { id: 3316, name: "Topaz" },
    { id: 3315, name: "Topazes" },
    { id: 3309, name: "Ngọc Đỏ" },
    { id: 3310, name: "Saphire" },
    { id: 3313, name: "Pha Lê Swarovski" },
    { id: 3314, name: "Titan" },
    { id: 2169, name: "Ngọc xanh lá cây" },
    { id: 2170, name: "Ngọc biển" },
    { id: 2171, name: "Gốm" },
    { id: 3312, name: "Đá spinel" },
    { id: 3306, name: "Ngọc xanh" },
    { id: 3317, name: "Zircon" },
    { id: 3305, name: "Zircon" },
    { id: 5274, name: "Crystal" },
    { id: 3308, name: "Cao su" },
    { id: 5287, name: "Khảm xà cừ" },
  ];
  const chucNangArray = [
    { id: 4287, name: "Astronomical" },
    { id: 4288, name: "Chiming" },
    { id: 4289, name: "Minute Repeater" },
    { id: 3302, name: "Tourbillion" },
    { id: 3299, name: "Perpetual" },
    { id: 3294, name: "Flyback Chronograph" },
    { id: 4297, name: "Rattrapante Chronograph" },
    { id: 4290, name: "Annual Calendar" },
    { id: 3293, name: "Equation of Time" },
    { id: 3298, name: "Multiple Time Zone" },
    { id: 4291, name: "Multiple Timezone" },
    { id: 3301, name: "Time Zone" },
    { id: 4293, name: "World Time" },
    { id: 4294, name: "World Timer" },
    { id: 3297, name: "Moon phase" },
    { id: 4292, name: "Moonphase" },
    { id: 3289, name: "Chronometer" },
    { id: 3284, name: "Alimeter" },
    { id: 3300, name: "Tachymeter" },
    { id: 5283, name: "Diver Watch" },
    { id: 4295, name: "GPS" },
    { id: 4296, name: "Alarm" },
    { id: 4298, name: "Chronograph" },
    { id: 4299, name: "Dual Time" },
    { id: 4300, name: "GMT" },
    { id: 4302, name: "Digital" },
    { id: 4303, name: "Complete Calendar" },
    { id: 5273, name: "Multifunction" },
    { id: 4304, name: "Calendar" },
    { id: 5272, name: "Day-Date" },
    { id: 4305, name: "Date" },
    { id: 5275, name: "Day & Night" },
    { id: 5291, name: "Time" },
    { id: 4287, name: "Astronomical" },
    { id: 4288, name: "Chiming" },
    { id: 4289, name: "Minute Repeater" },
    { id: 3302, name: "Tourbillion" },
    { id: 3299, name: "Perpetual" },
    { id: 3294, name: "Flyback Chronograph" },
    { id: 4297, name: "Rattrapante Chronograph" },
    { id: 4290, name: "Annual Calendar" },
    { id: 3293, name: "Equation of Time" },
    { id: 3298, name: "Multiple Time Zone" },
    { id: 4291, name: "Multiple Timezone" },
    { id: 3301, name: "Time Zone" },
    { id: 4293, name: "World Time" },
    { id: 4294, name: "World Timer" },
    { id: 3297, name: "Moon phase" },
    { id: 4292, name: "Moonphase" },
    { id: 3289, name: "Chronometer" },
    { id: 3284, name: "Alimeter" },
    { id: 3300, name: "Tachymeter" },
    { id: 5283, name: "Diver Watch" },
    { id: 4295, name: "GPS" },
    { id: 4296, name: "Alarm" },
    { id: 4298, name: "Chronograph" },
    { id: 4299, name: "Dual Time" },
    { id: 4300, name: "GMT" },
    { id: 4302, name: "Digital" },
    { id: 4303, name: "Complete Calendar" },
    { id: 5273, name: "Multifunction" },
    { id: 4304, name: "Calendar" },
    { id: 5272, name: "Day-Date" },
    { id: 4305, name: "Date" },
    { id: 5275, name: "Day & Night" },
    { id: 5291, name: "Time" },
  ];
  const chongNuocArray = [
    { id: 3272, name: "1 ATM" },
    { id: 3274, name: "3 ATM" },
    { id: 3275, name: "5 ATM" },
    { id: 3276, name: "10 ATM" },
    { id: 3277, name: "15 ATM" },
    { id: 3278, name: "20 ATM" },
    { id: 3279, name: "30 ATM" },
    { id: 3280, name: "50 ATM" },
    { id: 3281, name: "100 ATM" },
    { id: 3282, name: "200 ATM" },
  ];
  const giaArray = [
    { id: 0, name: "< 7 triệu" },
    { id: 1, name: "7 - 20 triệu" },
    { id: 2, name: "20 - 50 triệu" },
    { id: 3, name: "50 - 200 triệu" },
    { id: 4, name: "200 - 500 triệu" },
    { id: 5, name: "> 500 triệu" },
  ];

  return (
    <div className="products">
      {/* ============================================================ SLIDER ============================================= */}
      <Slideshow />

    
      <section className="featured-products  container">
        <h2>Đồng hồ nữ đẹp - cao cấp</h2>
        {/* ==================================== NÚT DANH MỤC VÀ SẮP XẾP ======================================== */}
        <div class="row filter-sort" id="filter-sort">
          <div class="col p-0">
            <div
              class="sorting-actions product-listing"
              id="product-search-results"
            >
              <div class="row grid-header no-gutters justify-content-center">
                <div class="result-count d-flex">
                  <div class="search-result-filters">
                    <button className="search-result">
                      <select
                        name="sort-order"
                        class="custom-select filled "
                        aria-label="Sắp xếp theo"
                      >
                        <option class="default" value="" data-id="default">
                          Mặc định
                        </option>
                        <option
                          class="Best-Sellers"
                          value="best-seller"
                          data-id="Best-Sellers"
                        >
                          Bán chạy
                        </option>
                        <option
                          class="price-high-to-low"
                          value="price-za"
                          data-id="price-high-to-low"
                          selected=""
                        >
                          Giá cao - thấp
                        </option>
                        <option
                          class="price-low-to-high"
                          value="price-az"
                          data-id="price-low-to-high"
                        >
                          Giá thấp - cao
                        </option>
                        <option class="new-in" value="new" data-id="new-in">
                          Sản phẩm mới
                        </option>
                      </select>
                      {/* <span class="sort-order-replace d-flex justify-content-center align-items-center " > */}
                      Sắp xếp theo
                      {/* </span> */}
                    </button>
                  </div>
                  <div class="search-result-filters">
                    <button
                      onClick={openOffcanvas}
                      type="button"
                      class="filter-results "
                      data-bs-toggle="offcanvas"
                      data-bs-target="#sidebar-filter"
                      aria-controls="sidebar-filter"
                      arial-label="Bộ lọc sản phẩm"
                    >
                      Lọc sản phẩm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* =========================================== sản phẩm ================================= */}
        <div className="product-list gridBlock row row-eq-height gx-1 row-cols-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-3 row-cols-xxl-4">
          {featuredProducts.slice(0, visibleProducts).map((product) => {
            // Tính giá khuyến mãi nếu có phần trăm khuyến mãi
            const discountPrice = product.discountPrice
              ? product.price - (product.price * product.discountPrice) / 100
              : "";

            return (
              <div
                className="swiper-wrappe"
                style={{
                  width: " 312px",
                  marginBottom: "4px",
                }}
                key={product.id}
              >
                <button
                  className="like-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(product.id);
                  }} // Toggle like state on click
                >
                  <span>
                    <HeartIcon
                      size="24px"
                      marginLeft={"1.5px"}
                      color={
                        likedProducts.includes(product.id) ? "#b29c6e" : "white"
                      }
                    />
                  </span>
                </button>
                <button
                  className="add-to-cart-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(product);
                  }}
                >
                  <span style={{ color: "white" }}>
                    <FaShoppingCart
                      size={25}
                      style={{
                        color: "white",
                        stroke: "#b29c6e",
                        strokeWidth: 42,
                      }}
                    />
                  </span>
                </button>

                <div className="swiper-slide swiper-slide-active">
                  <div className="product-box h-100 bg-gray relative">
                    <a
                    href={`/product/${product.id}`}// phải có link thì mới có hiện con trỏ bàn tay nhấn
                      className="plain"
                      onClick={() =>
                        (window.location.href = `/product/${product.id}`)
                      }
                    >
                      <div className="product-item">
                        <img
                          src={`${BASE_URL}/uploads/products/${product.image}`}
                          alt={product.name}
                          className="product-image img-fluid"
                        />
                      </div>

                      <div className="product-info">
                        <p className="product-title">{product.name}</p>

                        {/* Hiển thị giá gốc */}
                        <p
                          className={`product-price ${
                            discountPrice ? "line-through" : ""
                          }`}
                        >
                          {formatPrice(product.price)}
                        </p>

                        {/* Nếu sản phẩm có giá khuyến mãi, hiển thị giá khuyến mãi */}
                        {discountPrice && (
                          <p
                            className="product-discount-price"
                            style={{ color: "#a60101" }} // Màu đỏ cho giá khuyến mãi
                          >
                            Giá khuyến mãi: {formatPrice(discountPrice)}
                          </p>
                        )}
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* ================== MENU CON ==================== */}
        <div
          className={`offcanvas offcanvas-end product-filter ${
            isOffcanvasVisible ? "show" : ""
          }`}
          class="offcanvas offcanvas-end product-filter show"
          data-bs-scroll="true"
          tabindex="-1"
          id="sidebar-filter"
          aria-labelledby="Bộ lọc sản phẩm"
          aria-modal="true"
          role="dialog"
          style={{ visibility: isOffcanvasVisible ? "visible" : "hidden" }}
        >
          <div class="offcanvas-header">
            <h2 class="offcanvas-title uppercase">Bộ lọc sản phẩm</h2>
            <button
              type="button"
              class="icon-close icon-cross"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div class="offcanvas-body filter-body">
            <div class="applied-col">
              <div class="applied-title">
                <span class="strong uppercase">Lựa chọn</span>
                <span class="applied-clear">Clear all</span>
              </div>
              <div class="applied-filters"></div>
            </div>
            <hr />
            <div class="filter-col">
              <FilterItem
                title="Thương hiệu"
                class="filter-options"
                filters={brands}
              ></FilterItem>
                  <hr />
            </div>
        
            <div class="filter-col">
              <FilterItem title="Loại máy" filters={loaiMayArray}></FilterItem>
            <hr />
            </div>
   
            <div class="filter-col">
              <FilterItem
                title=" Chất liệu dây"
                class="filter-options"
                filters={dayArray}
              ></FilterItem>
            <hr />
            </div>
   
            <div class="filter-col">
              <FilterItem
                title="Màu sắc "
                class="filter-options"
                filters={mauSacArray}
              ></FilterItem>
            <hr />
            </div>
   
            <div class="filter-col">
              <FilterItem
                title="Đường kính "
                class="filter-options"
                filters={duongKinhArray}
              ></FilterItem>
            <hr />
            </div>
   
            <div class="filter-col">
              <FilterItem
                title="Style "
                class="filter-options"
                filters={styleArray}
              ></FilterItem>
            <hr />
            </div>
   
            <div class="filter-col">
              <FilterItem
                title="Tính năng "
                class="filter-options"
                filters={chucNangArray}
              ></FilterItem>
            <hr />
            </div>
   
            <div class="filter-col">
              <FilterItem
                title="Độ chống nước "
                class="filter-options"
                filters={chongNuocArray}
              ></FilterItem>
            <hr />
            </div>
   
            <div class="filter-col">
              <FilterItem
                title="Khoảng giá "
                class="filter-options "
                filters={giaArray}
              ></FilterItem>
            <hr />
            </div>
   
          </div>
          <div class="offcanvas-footer reset-bar">
            <div class="secondary-bar d-flex">
              <button
                class="btn btn-secondary btn-lg dot close"
                data-bs-dismiss="offcanvas"
                arial-label="Close"
              >
                Đóng
              </button>
              <button
                class="apply btn btn-secondary btn-lg"
                arial-label="Apply"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
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
                          {/* Map provinces here */}
                        </Select>
                        {errors.province && (
                          <FormErrorMessage>{errors.province}</FormErrorMessage>
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
                          {/* Map cities based on selected province */}
                        </Select>
                        {errors.city && (
                          <FormErrorMessage>{errors.city}</FormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>

                    <FormControl mb={3} isInvalid={errors.address}>
                      <FormLabel htmlFor="address">Địa chỉ nhận hàng</FormLabel>
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
                    <Button type="submit" className="button_order">
                      Đặt hàng
                    </Button>
                  </form>
                </Box>

                {/* Product Summary Section */}
                {selectedProduct && (
                  <Box flex={5}>
                    <Box
                      background="#e4cc972e"
                      mb="40px"
                      p="20px"
                      borderRadius="6px"
                    >
                      <Flex justifyContent="space-between" columnGap="30px">
                        <Img
                          src={`${BASE_URL}/uploads/products/${selectedProduct.image}`}
                          alt={selectedProduct.name}
                          maxWidth="114px"
                        />
                        <Box width="78%">
                          <Heading as="h5" size="sm" mb={2}>
                            {selectedProduct.name}
                          </Heading>
                          <Text>MSP: {selectedProduct.id}</Text>
                          <Flex justify="space-between" align="center" my={4}>
                            <Flex align="center" gap={1}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={decreaseQuantity}
                              >
                                -
                              </Button>
                              <Input
                                px={2}
                                value={quantity}
                                readOnly
                                textAlign="center"
                                width="60px"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={increaseQuantity}
                              >
                                +
                              </Button>
                            </Flex>
                            <Text fontWeight="bold">
                              {formatPrice(selectedProduct.price)}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                      <Divider borderColor="black" />
                      <Box display="flex" justifyContent="space-between">
                        <Text my={3}>Vận chuyển:</Text>
                        <Text my={3}>Miễn phí</Text>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Heading as="h5" size="sm">
                          Tổng cộng:
                        </Heading>
                        <Heading as="h5" size="sm">
                          {formatPrice(selectedProduct.price * quantity)}
                        </Heading>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Flex>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCloseModal}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductsWomen;
