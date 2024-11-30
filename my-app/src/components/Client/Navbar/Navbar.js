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

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");
  const isLoggedIn = !!username;
  const { getTotalUniqueItems } = useContext(CartContext);

  const [categories, setCategories] = useState([]);

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

  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += 4) {
    chunkedCategories.push(categories.slice(i, i + 4));
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const [activeLink, setActiveLink] = useState(localStorage.getItem("activeLink") || "");

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
      localStorage.setItem("token", token);
      const decodedUser = jwtDecode(token);
      if (decodedUser && decodedUser.name) {
        localStorage.setItem("username", decodedUser.name);
        setUsername(decodedUser.name);
      }
      if (decodedUser && decodedUser.avatar) {
        setAvatar(decodedUser.avatar);
      }

      window.history.replaceState(null, "", window.location.pathname);
    }
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
            <img src="/assets/logo/logo.png" alt="Logo" className="logo-image" />
          </Link>
          <div className="navbar-links">
            <Link
              to="/"
              className={`nav-link-trend ${activeLink === "/" ? "active-link" : ""}`}
              onClick={() => handleLinkClick("/")}
            >
              Trang chủ
            </Link>
            <Link
              to="/about"
              className={`nav-link-introduce ${activeLink === "/about" ? "active-link" : ""}`}
              onClick={() => handleLinkClick("/about")}
            >
              Giới thiệu
            </Link>
            <div className="dropdown">
              <Link
                to="/products"
                className={`dropbtn ${activeLink === "/menu" ? "active-link" : ""}`}
                onClick={() => handleLinkClick("/menu")}
              >
                Menu <CgChevronDown />
              </Link>
              <div className="dropdown-content">
                {chunkedCategories.map((chunk, index) => (
                  <div className="dropdown-section" key={index}>
                    <ul className="category-row">
                      {chunk.map((category) => (
                        <li key={category.id}>
                          <Link to={`/categories/${category.id}`}>{category.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

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
                  className="formcontrol me-2"
                  type="search"
                  placeholder="Search"
                />
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
                <nav className="navbar-expand-lg">
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
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                          <a
                            className="nav-link d-flex align-items-center no-caret"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <div className="avatar-container">
                              <img
                                src="https://khoinguonsangtao.vn/wp-content/uploads/2022/10/hinh-anh-vu-tru-ngan-ha.jpg"
                                alt="User Avatar"
                                className="avatar"
                              />
                            </div>
                            <p className="mb-0 username-text">
                              <h4>{username}</h4>
                            </p>
                          </a>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <a
                                className="dropdown-item "
                                href="/profile"
                                style={{ display: "flex", alignItems: "center" }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="#b29c6e">
                                  <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3 448 486.4 444.7 490 440 490H8C3.3 490 0 486.4 0 482.3z" />
                                </svg>
                                <p className="mb-0">Hồ sơ</p>
                              </a>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <a className="dropdown-item" onClick={handleLogout} style={{ display: "flex", alignItems: "center" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="#b29c6e">
                                  <path d="M512 232c0 13.3-10.7 24-24 24h-232v56c0 13.3-10.7 24-24 24h-96c-13.3 0-24-10.7-24-24v-56h-232c-13.3 0-24-10.7-24-24V56c0-13.3 10.7-24 24-24h232V-24c0-13.3 10.7-24 24-24h96c13.3 0 24 10.7 24 24v56h232c13.3 0 24 10.7 24 24v176z" />
                                </svg>
                                <p className="mb-0">Đăng xuất</p>
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
