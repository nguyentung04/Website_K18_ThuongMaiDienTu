/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { CgChevronDown } from "react-icons/cg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const isLoggedIn = !!username;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/signin");
  };
  /** ======================== đổi màu chữ sao khi click ( navbar ) ===================== */

  // Lấy giá trị `activeLink` từ localStorage hoặc đặt mặc định là chuỗi rỗng
  const [activeLink, setActiveLink] = useState(
    localStorage.getItem("activeLink") || ""
  );

  // Hàm xử lý khi nhấp vào link
  const handleLinkClick = (link) => {
    setActiveLink(link); // Cập nhật trạng thái `activeLink`
    localStorage.setItem("activeLink", link); // Lưu giá trị vào localStorage
  };

  // Sử dụng `useEffect` để đặt lại `activeLink` khi trang được tải lại
  useEffect(() => {
    const savedLink = localStorage.getItem("activeLink");
    if (savedLink) {
      setActiveLink(savedLink);
    }
  }, []);

  return (
    <div className="stopnav">
      <nav className="Navbar ">
        <div className="container">
          <Link
            to="/"
            className="navbar-logo"
            onClick={() => handleLinkClick("/")}
          >
            <img src="" alt="Logo" className="logo-image" />
          </Link>
          <div className="navbar-links">
            <Link
              to="/about"
              className={`nav-link-introduce ${
                activeLink === "/about" ? "active-link" : ""
              }`}
              onClick={() => handleLinkClick("/about")}
            >
              Giới thiệu
            </Link>

            <Link
              to="/trend"
              className={`nav-link-trend ${
                activeLink === "/trend" ? "active-link" : ""
              }`}
              onClick={() => handleLinkClick("/trend")}
            >
              Xu hướng
            </Link>
            <div className="dropdown">
              <Link
                to="/products"
                className={`dropbtn ${
                  activeLink === "/menu" ? "active-link" : ""
                }`}
                onClick={() => handleLinkClick("/menu")}
              >
                Menu <CgChevronDown />
              </Link>
              <div className="dropdown-content">
                {/* Existing Dropdown Sections */}
                <div className="dropdown-section">
                  <h4>Hãng Phổ biến</h4>
                  <hr />
                  <ul>
                    <li>
                      <Link to="/casio">Casio</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/orient">Orient</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/seiko">Seiko</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/citizen">Citizen</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/olympianus">Olympianus</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/bentley">Bentley</Link>
                    </li>
                    <li>
                      <Link to="/bulova">Bulova</Link>
                    </li>
                    <li>
                      <Link to="/daniel-wellington">Daniel Wellington</Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Hãng khác</h4>
                  <hr />
                  <ul>
                    <li>
                      <Link to="/carnival">Carnival</Link>
                    </li>{" "}
                    <li>
                      {" "}
                      <Link to="/calvin-klein">Calvin Klein</Link>
                    </li>{" "}
                    <li>
                      {" "}
                      <Link to="/boomest-gatti">Boomest Gatti</Link>
                    </li>{" "}
                    <li>
                      {" "}
                      <Link to="/daniel-klein">Daniel Klein</Link>
                    </li>{" "}
                    <li>
                      {" "}
                      <Link to="/free-look">Free Look</Link>
                    </li>{" "}
                    <li>
                      <Link to="/seven-friday">SevenFriday</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/versace">Versace</Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Hàng cao cấp</h4>
                  <hr />
                  <ul>
                    <li>
                      {" "}
                      <Link to="/tissot">Tissot</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/frederique-constant">Frederique Constant</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/orient-star">Orient Star</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/longines">Longines</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/omega">Omega</Link>
                    </li>
                    <li>
                      <Link to="/certina">Certina</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/ogival">Ogival</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/movado">Movado</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/maurice-lacroix">Maurice Lacroix</Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Phân loại đồng hồ</h4>
                  <hr />
                  <ul>
                    <li>
                      {" "}
                      <Link to="/dai-da-tong-hop">Dây da tổng hợp</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/dai-kim-loai">Dây kim loại</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/co-automatic">Cơ (Automatic)</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/pin-quartz">Pin (Quartz)</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/dien-tu">Điện tử</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/nhat-ban">Nhật Bản</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/thuy-sy">Thụy Sỹ</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/luxury">Luxury (Cao cấp)</Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Phong cách</h4>
                  <hr />
                  <ul>
                    <li>
                      {" "}
                      <Link to="/quan-doi">Quân đội</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/cong-so">Công sở</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/couple">Cặp đôi</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/mat-vuong">Mặt vuông</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/giong-rolex">Giống Rolex</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/giong-hublot">Giống Hublot</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/giong-patek-philippe">
                        Giống Patek Philippe
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/giong-richard-mille">Giống Richard Mille</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="dropdown">
              <Link
                to="/men"
                className={`nav-link-trend ${
                  activeLink === "/men" ? "active-link" : ""
                }`}
                onClick={() => handleLinkClick("/men")}
              >
                Nam
                <CgChevronDown />
              </Link>

              <div className="dropdown-content">
                {/* Dropdown Content for "Nam" */}
                <div className="dropdown-section">
                  <h4>Mức giá</h4>
                  <hr />
                  <ul>
                    <li>
                      {" "}
                      <Link to="/products?price=under-1m">Dưới 1 triệu</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?price=1m-3m">
                        Từ 1 triệu - 3 triệu
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?price=3m-6m">
                        Từ 3 triệu - 6 triệu
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?price=6m-9m">
                        Từ 6 triệu - 9 triệu
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?price=above-9m">Trên 9 triệu</Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Hãng nổi bật</h4>
                  <hr />
                  <ul>
                    <li>
                      <Link to="/products?brand=casio">Casio</Link>
                    </li>
                    <li>
                      <Link to="/products?brand=orient">Orient</Link>
                    </li>
                    <li>
                      <Link to="/products?brand=seiko">Seiko</Link>
                    </li>
                    <li>
                      <Link to="/products?brand=citizen">Citizen</Link>
                    </li>
                    <li>
                      <Link to="/products?brand=olympianus">Olympianus</Link>
                    </li>
                    <li>
                      <Link to="/products?brand=bentley">Bentley</Link>
                    </li>
                    <li>
                      <Link to="/products?brand=frederiqueconstant">
                        Frederique Constant
                      </Link>
                    </li>
                    <li>
                      <Link to="/products?brand=tissot">Tissot</Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Loại dây</h4>
                  <hr />
                  <ul>
                    <li>
                      <Link to="/products?strap=metal">Dây kim loại</Link>
                    </li>
                    <li>
                      <Link to="/products?strap=leather">Dây da tổng hợp</Link>
                    </li>
                    <li>
                      <Link to="/products?strap=plastic">Dây nhựa</Link>
                    </li>
                    <li>
                      <Link to="/products?strap=rubber">Dây cao su</Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Loại máy</h4>
                  <hr />
                  <ul>
                    <li>
                      {" "}
                      <Link to="/products?movement=automatic">
                        Cơ (Automatic)
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?movement=quartz">Pin (Quartz)</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?movement=solar">
                        Năng lượng ánh sáng
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Dòng đặc biệt</h4>
                  <hr />
                  <ul>
                    <li>
                      {" "}
                      <Link to="/products?special=rolex-style">
                        Giống Rolex
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?special=hublot-style">
                        Giống Hublot
                      </Link>
                    </li>
                    <li>
                      <Link to="/products?special=casio-ltp">Casio LTP</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?special=g-shock">G-Shock</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?special=baby-g">Baby-G</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?special=luxury">Sang chảnh</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?special=bracelet">Dây lắc</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="dropdown">
              <Link
                to="/women"
                className={`nav-link-trend ${
                  activeLink === "/women" ? "active-link" : ""
                }`}
                onClick={() => handleLinkClick("/women")}
              >
                Nữ <CgChevronDown />
              </Link>
              <div className="dropdown-content">
                {/* Dropdown Content for "Nữ" */}
                <div className="dropdown-section">
                  <h4>Mức giá</h4>
                  <hr />
                  <ul>
                    <li>
                      {" "}
                      <Link to="/products?price=under-1m">Dưới 1 triệu</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?price=1m-3m">
                        Từ 1 triệu - 3 triệu
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?price=3m-6m">
                        Từ 3 triệu - 6 triệu
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?price=6m-9m">
                        Từ 6 triệu - 9 triệu
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?price=above-9m">Trên 9 triệu</Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Hãng nổi bật</h4>
                  <hr />
                  <ul>
                    <li>
                      {" "}
                      <Link to="/products?brand=casio">Casio</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?brand=orient">Orient</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?brand=seiko">Seiko</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?brand=citizen">Citizen</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?brand=olympianus">Olympianus</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?brand=bentley">Bentley</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?brand=frederiqueconstant">
                        Frederique Constant
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?brand=tissot">Tissot</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?brand=longines">Longines</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?brand=omega">Omega</Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Loại dây</h4>
                  <hr />
                  <ul>
                    <li>
                      {" "}
                      <Link to="/products?strap=metal">Dây kim loại</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?strap=leather">Dây da tổng hợp</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?strap=plastic">Dây nhựa</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?strap=rubber">Dây cao su</Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Loại máy</h4>
                  <hr />
                  <ul>
                    <li>
                      {" "}
                      <Link to="/products?movement=automatic">
                        Cơ (Automatic)
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?movement=quartz">Pin (Quartz)</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?movement=solar">
                        Năng lượng ánh sáng
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown-section">
                  <h4>Dòng đặc biệt</h4>
                  <hr />
                  <ul>
                    <li>
                      {" "}
                      <Link to="/products?special=rolex-style">
                        Giống Rolex
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?special=hublot-style">
                        Giống Hublot
                      </Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?special=casio-ltp">Casio LTP</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?special=g-shock">G-Shock</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?special=baby-g">Baby-G</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?special=luxury">Sang chảnh</Link>
                    </li>
                    <li>
                      {" "}
                      <Link to="/products?special=bracelet">Dây lắc</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Link
              to="/premium"
              className={`nav-link-trend ${
                activeLink === "/premium" ? "active-link" : ""
              }`}
              onClick={() => handleLinkClick("/premium")}
            >
              Cũ cao cấp
            </Link>
            <form class="d-flex " role="search">
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
            <button type="button" class="btn  position-relative">
              <Link to="/cart" className="cart-link">
                <button style={{ marginTop: "4px", marginRight: "13px" }}>
                  <FaShoppingCart
                    size={25}
                    color="white"
                    style={{ stroke: "#b29c6e", strokeWidth: 42 }}
                  />
                </button>
                <span class="position-absolute top-0  translate-middle badge rounded-pill bg-danger">
                  99+
                  <span class="visually-hidden">unread messages</span>
                </span>
              </Link>
            </button>
            {isLoggedIn ? (
              <>
                {/* <Link to="/orderhistory" className="order-history-link">
              Đơn hàng
            </Link>
            <span className="navbar-username">Xin chào | {username}</span>
            <button className="logout-button" onClick={handleLogout}>
              Đăng xuất
            </button> */}

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
                                  <path d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z" />
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
              <Link to="/signin" className="login">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
