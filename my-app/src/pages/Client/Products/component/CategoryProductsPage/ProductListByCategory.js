import React, { useState, useEffect} from "react";
import { fetchProductsByCategory } from "../../../../../service/api/products";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useParams } from "react-router-dom";
import './ProductListByCategory.css';

import Slideshow from "../Slideshow/Slideshow";

const BASE_URL = "http://localhost:3000"
const ProductListByCategory = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-item">
                <img
                  src={`${BASE_URL}/uploads/products/${product.images}`}
                  alt={product.name}
                  className="product-image img-fluid"
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-footer">
                  <p className="product-price">Giá: {product.price} VNĐ</p>
                  <button className="btn-buy">Mua ngay</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có sản phẩm nào thuộc loại này.</p>
      )}
    </div>
  );
};

export default ProductListByCategory;
