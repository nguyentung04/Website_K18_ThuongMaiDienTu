import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { IconFacebook, IconInstagram, IconPhone, IconSoundCloud, IconZalo } from "../../icon/icon";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <div className="content">
          {/* Dropdown Content for "Nữ" */}
          <div className="section">
            <span>Trợ giúp khách hàng</span>
            <hr />
            <ul>
              <li>
                {" "}
                <Link to="/products?price=under-1m">Giới thiệu về ......</Link>
              </li>
              <li>
                {" "}
                <Link to="/products?price=1m-3m">Phản ánh - khiếu nại</Link>
              </li>
              <li>
                {" "}
                <Link to="/products?price=3m-6m">Chứng nhận đại lý</Link>
              </li>
              <li>
                {" "}
                <Link to="/products?price=6m-9m">Tin tức công ty</Link>
              </li>
              <li>
                {" "}
                <Link to="/products?price=above-9m">Kiến thức đồng hồ</Link>
              </li>
            </ul>
          </div>
          <div className="section">
            <span>Chính sách chung</span>
            <hr />
            <ul>
              <li>
                {" "}
                <Link to="/products?brand=casio">Điều khoản thanh toán</Link>
              </li>
              <li>
                {" "}
                <Link to="/products?brand=orient">Chính sách bảo hành</Link>
              </li>
              <li>
                {" "}
                <Link to="/products?brand=seiko">Chính sách bảo mật</Link>
              </li>
              <li>
                {" "}
                <Link to="/products?brand=citizen">Chính sách vận chuyển</Link>
              </li>
              <li>
                {" "}
                <Link to="/products?brand=olympianus">Chính sách đổi trả</Link>
              </li>
              <li>
                {" "}
                <Link to="/products?brand=frederiqueconstant">
                  Bảo hành & sửa chữa đồng hồ
                </Link>
              </li>
            </ul>
          </div>
          <div className="section">
            <span>LIÊN HỆ HỖ TRỢ</span>
            <hr />
            <ul>
              <li>
                {" "}
                
                <Link to="/products?strap=metal"><span>Tư vấn mua hàng:</span>1800 0091 </Link>
              </li>
              <li>
                {" "}
                <Link to="/products?strap=leather"><span>Tư vấn mua hàng:</span>1800 0091</Link>
              </li>
              <li>
                {" "}
                <Link to="/products?strap=plastic"><span>Tư vấn mua hàng:</span>1800 0091</Link>
              </li>
              <li>
                {" "}
                <Link to="/products?strap=rubber"><span>Tư vấn mua hàng:</span>1800 0091</Link>
              </li>
            </ul>

            <span>Theo dõi chúng tôi tại</span>
            <hr />
            <ul style={{display:"flex", justifyContent:"space-around"}}>
              <li>
                {" "}
                <Link to="/products?movement=automatic"><IconPhone /></Link>
              </li>
              <li>
                {" "}
                <Link to="/products?movement=quartz"><IconFacebook  /></Link>
              </li>
              <li>
                {" "}
                <Link to="/products?movement=solar"><IconInstagram  /></Link>
              </li>
              <li>
                {" "}
                <Link to="/products?movement=quartz"><IconSoundCloud  /></Link>
              </li>
              <li>
                {" "}
                <Link to="/products?movement=solar"><IconZalo  /></Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} DHB & FPoly. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
