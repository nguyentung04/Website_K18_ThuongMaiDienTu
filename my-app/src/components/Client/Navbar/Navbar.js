import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgChevronDown } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../componentss/Cart_Context";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Navbar.css";
import { jwtDecode } from "jwt-decode";
import { fetchCategories } from "../../../service/api/Category";
import { fetchProducts } from "../../../service/api/products";
import { List, ListItem } from "@chakra-ui/react";

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");
  const isLoggedIn = !!username;
  const { getTotalUniqueItems } = useContext(CartContext);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data); // Lưu danh mục vào state
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setSelectedProduct(data); // Lưu danh mục vào state
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };

    loadProducts();
  }, []);
  //thanh Tìm kiếm
  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query !== "") {
      const filteredSuggestions = selectedProduct.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const exactMatch = selectedProduct.find(
        (product) => product.name.toLowerCase() === searchQuery.toLowerCase()
      );
      if (exactMatch) {
        navigate(`/product/${exactMatch.id}`);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setSuggestions([]);
  };
  //-------------------------------------------------------------
  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += 4) {
    chunkedCategories.push(categories.slice(i, i + 4));
  }

  // Đăng xuất và xóa thông tin localStorage
  const handleLogout = () => {
    // Xóa tất cả dữ liệu liên quan đến phiên người dùng
    localStorage.removeItem("token"); // Xóa token
    localStorage.removeItem("username"); // Xóa tên đăng nhập
    localStorage.removeItem("userData");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail"); // Xóa email người dùng
    localStorage.removeItem("userName"); // Xóa tên người dùng
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    // ... có thể thêm các mục khác nếu cần

    // Chuyển hướng người dùng về trang đăng nhập
    navigate("/signin");

    // Tải lại trang
    window.location.reload();
  };

  const [activeLink, setActiveLink] = useState(
    localStorage.getItem("activeLink") || ""
  );

  const handleLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem("activeLink", link);
  };

  useEffect(() => {
    const savedLink = localStorage.getItem("activeLink");
    if (savedLink) setActiveLink(savedLink);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token); // Lưu token vào localStorage
      const decodedUser = jwtDecode(token); // Giải mã token để lấy thông tin người dùng
      if (decodedUser && decodedUser.name) {
        localStorage.setItem("username", decodedUser.name); // Lưu tên người dùng vào localStorage
        setUsername(decodedUser.name); // Cập nhật state username
      }
      if (decodedUser && decodedUser.avatar) {
        setAvatar(decodedUser.avatar); // Cập nhật state avatar
      }

      window.history.replaceState(null, "", window.location.pathname); // Thay đổi URL mà không tải lại trang
    }
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories(); // Gọi API để lấy danh mục
        setCategories(data); // Lưu danh mục vào state
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error); // Log lỗi nếu có
      }
    };

    loadCategories(); // Gọi hàm loadCategories khi component được render
  }, []);

  return (
    <div className="stopnav">
      <nav className="Navbar">
        <div className="container">
          <Link
            to="/"
            className="navbar-logo"
            onClick={() => handleLinkClick("/")}
          >
            <img
              src="/assets/logo/logo-dong-ho.png"
              alt="Logo"
              className="logo-image"
            />
          </Link>
          <div className="navbar-links">
            <Link
              to="/"
              className={`nav-link-trend ${
                activeLink === "/" ? "active-link" : ""
              }`}
              onClick={() => handleLinkClick("/")}
            >
              Trang chủ
            </Link>
            <Link
              to="/about"
              className={`nav-link-introduce ${
                activeLink === "/about" ? "active-link" : ""
              }`}
              onClick={() => handleLinkClick("/about")}
            >
              Giới thiệu
            </Link>
            <div className="dropdown">
              <Link
                to="/products"
                className={`dropbtn ${
                  activeLink === "/menu" ? "active-link" : ""
                }`}
                onClick={() => handleLinkClick("/menu")}
              >
                Sản phẩm <CgChevronDown />
              </Link>
              <div className="dropdown-content">
                {chunkedCategories.map((chunk, index) => (
                  <div className="dropdown-section" key={index}>
                    <ul className="category-row">
                      {chunk.map((category) => (
                        <li key={category.id}>
                          <Link to={`/products?category=${category.id}`}>
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/contact"
              className={`nav-link-trend ${
                activeLink === "/contact" ? "active-link" : ""
              }`}
              onClick={() => handleLinkClick("/contact")}
            >
              Liên hệ
            </Link>
            <Link
              to="/post"
              className={`nav-link-trend ${
                activeLink === "/post" ? "active-link" : ""
              }`}
              onClick={() => handleLinkClick("/post")}
            >
              Bài viết
            </Link>
            <form className="d-flex" role="search">
              <div className="search">
                <button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="20"
                    height="20"
                    fill="#b29c6e"
                  >
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                  </svg>
                </button>
                <input
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress} // Add this line to listen for the Enter key
                  className="formcontrol me-2"
                  type="search"
                  placeholder="Tìm kiếm"
                  variant="outline"
                  borderColor="#00aa9f"
                  color="black"
                  mr={2}
                  width="200px"
                />
                {suggestions.length > 0 && (
                  <ul
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      width: "200px",
                      border: "1px solid #ccc",
                      borderRadius: "md",
                      backgroundColor: "white",
                      zIndex: "1000",
                      maxHeight: "200px",
                      overflowY: "auto",
                      width: "auto",
                      textDecoration: "none",
                    }}
                  >
                    {suggestions.map((suggestion) => (
                      <li
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          transition: "background-color 0.3s",
                          textDecoration: "none",
                        }}
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/product/${suggestion.id}`}
                        >
                          {suggestion.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </form>
          </div>

          <div className="navbar-auth">
            <button type="button" className="btn position-relative">
              <Link to="/cart" className="cart-link">
                <button style={{ marginTop: "-4px", marginRight: "11px" }}>
                  <FaShoppingCart
                    size={25}
                    color="white"
                    style={{ stroke: "#b29c6e", strokeWidth: 42 }}
                  />
                </button>
                <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
                  {getTotalUniqueItems() > 0 && (
                    <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger">
                      {getTotalUniqueItems()}
                    </span>
                  )}
                </span>
              </Link>
            </button>
            {isLoggedIn ? (
              <>
                <nav className=" navbar-expand-lg">
                  <div className="container-fluid">
                    <button
                      className="navbar-toggler"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#navbarSupportedContent"
                      aria-controls="navbarSupportedContent"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                      className="collapse navbar-collapse"
                      id="navbarSupportedContent"
                    >
                      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                          <a
                            className="nav-link d-flex align-items-center no-caret"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {/* Avatar image */}
                            <div className="avatar-container">
                              <img
                                src="https://khoinguonsangtao.vn/wp-content/uploads/2022/10/hinh-anh-vu-tru-ngan-ha.jpg"
                                alt="User Avatar"
                                className="avatar"
                              />
                            </div>
                            {/* Username */}
                            <p className="mb-0 username-text">
                              <h4>{username}</h4>
                            </p>
                          </a>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <a
                                className="dropdown-item "
                                href="/profile"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 448 512"
                                  width="16"
                                  height="16"
                                  fill="#b29c6e"
                                >
                                  <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" />
                                </svg>
                                Thông tin cá nhân
                              </a>
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="/orderhistory"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  width="16"
                                  height="16"
                                  fill="#b29c6e"
                                >
                                  <path d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24z" />
                                </svg>
                                Lịch sử đơn hàng
                              </a>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={handleLogout}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  width="16"
                                  height="16"
                                  fill="#b29c6e"
                                >
                                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                                </svg>
                                Đăng xuất
                              </a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <button className="btn_login">Đăng nhập</button>
                </Link>
                <Link to="/signup">
                  <button className="btn_signup">Đăng ký</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
