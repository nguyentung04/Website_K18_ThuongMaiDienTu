import React, { useState, useEffect } from "react";
import { fetchProducts, fetchProductsByCategory, fetchProductsByPriceRange } from "../../../service/api/products";
import { fetchCategories } from "../../../service/api/Category";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const BASE_URL = "http://localhost:3000";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const [priceRange, setPriceRange] = useState(""); 

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");

  useEffect(() => {
    const loadProductsAndCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData);

        const productData = categoryId
          ? await fetchProductsByCategory(categoryId)
          : await fetchProducts();
        setProducts(productData);
      } catch (error) {
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    loadProductsAndCategories();
  }, [categoryId]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleGenderFilter = async (gender) => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/gender/${gender}`);
      const filteredProducts = await response.json();
      setProducts(filteredProducts);
    } catch (error) {
      setError("Không thể tải sản phẩm theo giới tính.");
    }
  };

  // Handle price filter
  const handlePriceFilter = async (range) => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/price-range/${range}`);
      const filteredProducts = await response.json();
      setProducts(filteredProducts);
      setPriceRange(range);
    } catch (error) {
      setError("Không thể tải sản phẩm theo giá.");
    }
  };

  // Hàm để hiển thị tất cả sản phẩm
  const handleShowAllProducts = async () => {
    try {
      const productData = await fetchProducts();
      setProducts(productData);
      setPriceRange("");  // Đặt lại giá trị select về 'Chọn khoảng giá'
    } catch (error) {
      setError("Không thể tải toàn bộ sản phẩm.");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách sản phẩm...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <h2>TẤT CẢ SẢN PHẨM</h2>
      <div className="d-flex justify-content-start align-items-center mb-2">
        <button className="btn btn-primary me-2" onClick={handleShowAllProducts} style={{ whiteSpace: 'nowrap' }}>
          Tất cả
        </button>

        <button onClick={() => handleGenderFilter('nam')} className="btn btn-category me-2">Nam</button>
        <button onClick={() => handleGenderFilter('nữ')} className="btn btn-category me-2">Nữ</button>

        {/* Price Range Filter */}
        <select
          onChange={(e) => handlePriceFilter(e.target.value)}
          className="form-select me-2"
          value={priceRange}  // Gắn giá trị từ state priceRange
        >
          <option value="">Chọn khoảng giá</option>
          <option value="0-10000000">Dưới 10 triệu</option>
          <option value="10000000-30000000">Từ 10 triệu đến 30 triệu</option>
          <option value="30000000-50000000">Từ 30 triệu đến 50 triệu</option>
          <option value="50000000">Trên 50 triệu</option>
        </select>
      </div>

      {products.length > 0 ? (
        <div>
          <div className="product-grid">
            {currentProducts.map((product) => {
              const discountPrice = product.discountPrice
                ? product.price - (product.price * product.discountPrice) / 100
                : "";
              const images = product.images ? product.images.split(',') : [];
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
        <p>Không có sản phẩm nào.</p>
      )}
    </div>
  );
};

export default Products;
