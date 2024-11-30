/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaShoppingCart } from "react-icons/fa";
import "./Products.css";
import CustomCheckbox from "./component/CustomCheckbox";
import Slideshow from "./component/Slideshow/Slideshow";

const BASE_URL = "http://localhost:3000"; // Adjust this if needed

const FilterItem = ({ title, children, filters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const filterRef = useRef(null);

  const [selectedFilters, setSelectedFilters] = useState([]);

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


const Products = () => {
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
  //Phân trang 
const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 16;

// Tính toán sản phẩm để hiển thị trên trang hiện tại
const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = featuredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

// Tổng số trang
const totalPages = Math.ceil(featuredProducts.length / productsPerPage);

const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};
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

  const loadMoreProducts = () => {
    setVisibleProducts((prevVisible) => prevVisible + 12); // Tăng số lượng sản phẩm hiển thị thêm 6 sản phẩm
  };

  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);

  // Hàm để mở offcanvas
  const openOffcanvas = () => {
    setIsOffcanvasVisible(true);
  };

  const toggleLike = (productId) => {
    setLikedProducts(
      (prevLiked) =>
        prevLiked.includes(productId)
          ? prevLiked.filter((id) => id !== productId) // Unlike
          : [...prevLiked, productId] // Like
    );
  };

  const brands = [ ];
  const loaiMayArray = [ ];
  const dayArray = [ ];
  const mauSacArray = [ ];
  const duongKinhArray = [ ];
  const styleArray = [ ];
  const chucNangArray = [ ];
  const chongNuocArray = [ ];
  const giaArray = [ ];

  return (
    <div className="products">
      <Slideshow />
      <section className="featured-products  container">
        <h2>SẢN PHẨM CỦA CHÚNG TÔI</h2>
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
                      Sắp xếp theo
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
        <div>
          <div className="product-list gridBlock row row-eq-height gx-1 row-cols-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-3 row-cols-xxl-4">
            {currentProducts.map((product) => {
              const discountPrice = product.discountPrice
                ? product.price - (product.price * product.discountPrice) / 100
                : "";

              return (
                <div
                  className="swiper-wrappe"
                  style={{
                    width: "312px",
                    marginBottom: "4px",
                  }}
                  key={product.id}
                >
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
                    <div className="product-box h-100 relative">
                      <a
                        href={`/product/${product.id}`}
                        className="plain"
                        onClick={() => (window.location.href = `/product_detail/${product.id}`)}
                      >
                        <div className="product-item">
                          <img
                            src={`${BASE_URL}/uploads/products/${product.images}`}
                            alt={product.name}
                            className="product-image img-fluid"
                          />
                        </div>

                        <div className="product-info">
                          <p className="product-title">{product.name}</p>

                          <p
                            className={`product-price ${discountPrice ? "line-through" : ""}`}
                          >
                            {formatPrice(product.price)}
                          </p>

                          {discountPrice && (
                            <p
                              className="product-discount-price"
                              style={{ color: "#a60101" }}
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
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </div>
        </div>
        <div
          className={`offcanvas offcanvas-end product-filter ${isOffcanvasVisible ? "show" : ""
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
    </div>
  );
};

export default Products;