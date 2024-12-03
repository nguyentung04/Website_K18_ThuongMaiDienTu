import React, { useState, useEffect } from "react";
import { fetchProductsByCategory } from "../../../../../service/api/products";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useParams, Link } from "react-router-dom"; 
import { FaShoppingCart } from "react-icons/fa";
import './ProductListByCategory.css';

const BASE_URL = "http://localhost:3000";

const ProductListByCategory = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const [gender, setGender] = useState(""); // Thêm state cho giới tính

  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);

  const openOffcanvas = () => {
    setIsOffcanvasVisible(true);
  };

  // Fetch sản phẩm theo categoryId và gender
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByCategory(categoryId, gender);
        setProducts(data);
      } catch (error) {
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, gender]); // Thêm gender vào dependency để reload khi thay đổi giới tính

  // Tính toán phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Nếu đang loading hoặc có lỗi
  if (loading) {
    return <div className="loading">Đang tải danh sách sản phẩm...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <h2>SẢN PHẨM CỦA CHÚNG TÔI</h2>
      <div className="row filter-sort" id="filter-sort">
        <div className="col p-0">
          <div className="sorting-actions product-listing" id="product-search-results">
            <div className="row grid-header no-gutters justify-content-center">
              <div className="result-count d-flex">
                <div className="search-result-filters">
                  <button className="search-result">
                    <select
                      name="sort-order"
                      className="custom-select filled"
                      aria-label="Sắp xếp theo"
                    >
                      <option className="default" value="" data-id="default">
                        Mặc định
                      </option>
                      <option
                        className="Best-Sellers"
                        value="best-seller"
                        data-id="Best-Sellers"
                      >
                        Bán chạy
                      </option>
                      <option
                        className="price-high-to-low"
                        value="price-za"
                        data-id="price-high-to-low"
                      >
                        Giá cao - thấp
                      </option>
                      <option
                        className="price-low-to-high"
                        value="price-az"
                        data-id="price-low-to-high"
                      >
                        Giá thấp - cao
                      </option>
                      <option className="new-in" value="new" data-id="new-in">
                        Sản phẩm mới
                      </option>
                    </select>
                    Sắp xếp theo
                  </button>
                </div>
                <div className="search-result-filters">
                  <button className="search-result">
                    <select
                      name="gender"
                      className="custom-select filled"
                      aria-label="Giới tính"
                      onChange={(e) => setGender(e.target.value)} // Cập nhật giới tính khi chọn
                    >
                      <option value="">Tất cả</option>
                      <option value="nam">Nam</option>
                      <option value="nữ">Nữ</option>
                    </select>
                    Giới tính
                  </button>
                </div>
                <div className="search-result-filters">
                  <button className="search-result">
                    Tất cả
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {products.length > 0 ? (
        <div>
          <div className="product-grid">
            {currentProducts.map((product) => {
              const discountPrice = product.discountPrice
                ? product.price - (product.price * product.discountPrice) / 100
                : "";
              return (
                <div key={product.id} className="product-card">
                  <Link to={`/product/${product.id}`} className="product-item-link">
                    <div className="product-item">
                      <img
                        src={`${BASE_URL}/uploads/products/${product.images}`}
                        alt={product.name}
                        className="product-image img-fluid"
                      />
                      <div className="product-actions">
                        <button className="add-to-cart-icon">
                          <FaShoppingCart size={25} style={{ color: "white" }} />
                        </button>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-description">{product.short_description}</p>
                      <div className="product-footer">
                        <p className={`product-price ${discountPrice ? "line-through" : ""}`}>
                          {formatPrice(product.price)}
                        </p>
                        {discountPrice && (
                          <p className="product-discount-price" style={{ color: "#a60101" }}>
                            Giá khuyến mãi: {formatPrice(discountPrice)}
                          </p>
                        )}
                        <button className="btn-buy">Mua ngay</button>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="pagination-container">
            <ul className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Không có sản phẩm nào thuộc loại này.</p>
      )}
    </div>
  );
};

export default ProductListByCategory;
