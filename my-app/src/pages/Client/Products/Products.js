import React, { useState, useEffect } from "react";
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchProductsByPriceRange,
} from "../../../service/api/products";
import { fetchCategories } from "../../../service/api/Category";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const [priceRange, setPriceRange] = useState("");
  const [quantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [userData, setUserData] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

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
      const response = await fetch(
        `${BASE_URL}/api/products/price-range/${range}`
      );
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
      setPriceRange(""); // Đặt lại giá trị select về 'Chọn khoảng giá'
    } catch (error) {
      setError("Không thể tải toàn bộ sản phẩm.");
    }
  };
  // ========================================= hàm thêm sản phẩm vào giỏ hàng -=---=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    if (isAddingToCart) return; // Không thực hiện nếu đang xử lý thêm vào giỏ hàng

    await addToCart(product);
    // handleOpenModal(product);
  };

  const addToCart = async (product) => {
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
          product_id: product.id,
          quantity,
          price: product.price,
          total: quantity * product.price,
        },
      ],
    };

    setIsAddingToCart(true);
    // Chỉ chuyển trang nếu `shouldNavigate` là true

    navigate("/cart", { state: { from: location.pathname } });
   
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
        <button
          className="btn btn-primary me-2"
          onClick={handleShowAllProducts}
          style={{ whiteSpace: "nowrap" }}
        >
          Tất cả
        </button>

        <button
          onClick={() => handleGenderFilter("nam")}
          className="btn btn-category me-2"
        >
          Nam
        </button>
        <button
          onClick={() => handleGenderFilter("nữ")}
          className="btn btn-category me-2"
        >
          Nữ
        </button>

        {/* Price Range Filter */}
        <select
          onChange={(e) => handlePriceFilter(e.target.value)}
          className="form-select me-2"
          value={priceRange} // Gắn giá trị từ state priceRange
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
              const images = product.images ? product.images.split(",") : [];
              return (
                <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className="product-item-link">
                  <div className="product-item">
                    <img
                      src={`${BASE_URL}/uploads/products/${product.images}`}
                      alt={product.name}
                      className="product-image img-fluid"
                    />
                 
                  </div>
                </Link>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.short_description}</p>
                  <div className="product-footer">
                    <p
                      className={`product-price ${
                        product.discountPrice ? "line-through" : ""
                      }`}
                    >
                      {formatPrice(product.price)}
                    </p>
                    {product.discountPrice && (
                      <p
                        className="product-discount-price"
                        style={{ color: "#a60101" }}
                      >
                        Giá khuyến mãi:{" "}
                        {formatPrice(
                          product.price - (product.price * product.discountPrice) / 100
                        )}
                      </p>
                    )}
                    {/* Nút "Mua ngay" */}
                    <button
                      className="btn-buy"
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={isAddingToCart}
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
              
              );
            })}
          </div>

          <div className="pagination-container">
            <ul className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                  >
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
