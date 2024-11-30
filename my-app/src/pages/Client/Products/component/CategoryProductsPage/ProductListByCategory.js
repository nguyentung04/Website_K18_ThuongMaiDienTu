import React, { useState, useEffect } from "react";
import { fetchProductsByCategory } from "../../../../../service/api/products";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useParams, Link } from "react-router-dom"; // Import Link
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

  // Fetch sản phẩm theo categoryId
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByCategory(categoryId);
        setProducts(data);
      } catch (error) {
        setError("Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId]);

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
      <h1 className="category-title">SẢN PHẨM CỦA CHÚNG TÔI</h1>
      {products.length > 0 ? (
        <div>
          <div className="product-grid">
            {currentProducts.map((product) => {
              const discountPrice = product.discountPrice
                ? product.price - (product.price * product.discountPrice) / 100
                : "";
              return (
                <div key={product.id} className="product-card">
                  <Link to={`/product/${product.id}`} className="product-item-link"> {/* Thêm Link vào đây */}
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
                      <p className="product-description">{product.short_description}</p> {/* Thay description thành short_description */}
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
