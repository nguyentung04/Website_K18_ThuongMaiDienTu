// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import { FaShoppingCart } from "react-icons/fa";
// import "./Products.css";

// const BASE_URL = "http://localhost:3000";

// const Products = () => {
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [quantity, setQuantity] = useState(1);
//   const [gender, setGender] = useState("");  // Thêm state để lưu giới tính

//   // Fetch sản phẩm theo giới tính khi giới tính thay đổi
//   useEffect(() => {
//     const fetchProductsByGender = async () => {
//       try {
//         const url = gender
//           ? `${BASE_URL}/api/products/gender/${gender}`
//           : `${BASE_URL}/api/products`;
//         const response = await fetch(url);
//         const data = await response.json();

//         // Kiểm tra dữ liệu có phải là mảng không
//         if (Array.isArray(data)) {
//           setFeaturedProducts(data); // Cập nhật nếu là mảng
//         } else {
//           console.error("Data is not an array:", data);
//           setFeaturedProducts([]); // Trả về mảng rỗng nếu không phải mảng
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setFeaturedProducts([]); // Trả về mảng rỗng nếu có lỗi
//       }
//     };

//     fetchProductsByGender();
//   }, [gender]);



//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   return (
//     <div className="products">
//       <section className="featured-products container">
//         <h2>SẢN PHẨM CỦA CHÚNG TÔI</h2>

//         {/* Dropdown cho chọn giới tính */}
//         <select onChange={(e) => setGender(e.target.value)} className="gender-select">
//           <option value="">Tất cả sản phẩm</option>
//           <option value="nam">Nam</option>
//           <option value="nữ">Nữ</option>
//           <option value="unisex">Unisex</option>
//         </select>

//         <div className="product-list gridBlock row row-eq-height gx-1 row-cols-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-3 row-cols-xxl-4">
//   {Array.isArray(featuredProducts) && featuredProducts.length > 0 ? (
//     featuredProducts.map((product) => {
//       const discountPrice = product.discountPrice
//         ? product.price - (product.price * product.discountPrice) / 100
//         : "";
//       return (
//         <div
//           className="swiper-wrapper"
//           style={{
//             width: "312px",
//             marginBottom: "4px",
//           }}
//           key={product.id}
//         >
//           <button
//             className="add-to-cart-icon"
//             onClick={() => {}}
//           >
//             <span style={{ color: "white" }}>
//               <FaShoppingCart
//                 size={25}
//                 style={{
//                   color: "white",
//                   stroke: "#b29c6e",
//                   strokeWidth: 42,
//                 }}
//               />
//             </span>
//           </button>
//           <div className="swiper-slide swiper-slide-active">
//             <div className="product-box h-100 relative">
//               <a
//                 href={`/product/${product.id}`}
//                 className="plain"
//               >
//                 <div className="product-item">
//                   <img
//                     src={
//                       product.images && product.images.length > 0
//                         ? `${BASE_URL}/uploads/products/${product.images}`
//                         : "default-image.jpg"
//                     }
//                     alt={product.name}
//                     className="product-image img-fluid"
//                   />
//                 </div>

//                 <div className="product-info">
//                   <p className="product-title">{product.name}</p>
//                   <p
//                     className={`product-price ${discountPrice ? "line-through" : ""}`}
//                   >
//                     {formatPrice(product.price)}
//                   </p>

//                   {discountPrice && (
//                     <p
//                       className="product-discount-price"
//                       style={{ color: "#a60101" }}
//                     >
//                       Giá khuyến mãi: {formatPrice(discountPrice)}
//                     </p>
//                   )}
//                 </div>
//               </a>
//             </div>
//           </div>
//         </div>
//       );
//     })
//   ) : (
//     <p>No featured products available.</p> // Hiển thị thông báo nếu không có sản phẩm
//   )}
// </div>

//       </section>
//     </div>
//   );
// };

// export default Products;
import React, { useState, useEffect } from "react";
import { fetchProducts, fetchProductsByCategory } from "../../../service/api/products";
import { fetchCategories } from "../../../service/api/Category";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
// import './Products.css';

const BASE_URL = "http://localhost:3000";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

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

  const handleCategoryClick = async (categoryId) => {
    try {
      const categoryProducts = await fetchProductsByCategory(categoryId);
      setProducts(categoryProducts);
    } catch (error) {
      setError("Không thể tải sản phẩm theo loại.");
    }
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

  // Hàm để hiển thị tất cả sản phẩm
  const handleShowAllProducts = async () => {
    try {
      const productData = await fetchProducts();
      setProducts(productData);
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
      <button className="btn btn-primary" onClick={handleShowAllProducts}>
        Tất cả
      </button>
      <button onClick={() => handleGenderFilter('nam')} className="btn btn-category">Nam</button>
      <button onClick={() => handleGenderFilter('nữ')} className="btn btn-category">Nữ</button>
      {/* <div className="category-buttons">
        {categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category.id}
              className="btn btn-category"
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))
        ) : (
          <p>Không có loại sản phẩm nào.</p>
        )}
      </div> */}

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

