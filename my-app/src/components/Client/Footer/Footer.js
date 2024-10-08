/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import {
  IconFacebook,
  IconInstagram,
  IconPhone,
  IconSoundCloud,
  IconZalo,
} from "../../icon/icon";

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
                <Link to="/products?strap=metal">
                  <span>Tư vấn mua hàng:</span>1800 0091{" "}
                </Link>
              </li>
              <li>
                {" "}
                <Link to="/products?strap=leather">
                  <span>Tư vấn mua hàng:</span>1800 0091
                </Link>
              </li>
              <li>
                {" "}
                <Link to="/products?strap=plastic">
                  <span>Tư vấn mua hàng:</span>1800 0091
                </Link>
              </li>
              <li>
                {" "}
                <Link to="/products?strap=rubber">
                  <span>Tư vấn mua hàng:</span>1800 0091
                </Link>
              </li>
            </ul>
          </div>

          <div className="section">
            <span>Theo dõi chúng tôi tại</span>
            <hr />
            <ul style={{ display: "flex", justifyContent: "space-around" }}>
              <li>
                <Link to="/products?movement=automatic">
                  <IconPhone />
                </Link>
              </li>
              <li>
                <Link to="/products?movement=quartz">
                  <IconFacebook />
                </Link>
              </li>
              <li>
                <Link to="/products?movement=solar">
                  <IconInstagram />
                </Link>
              </li>
              <li>
                <Link to="/products?movement=quartz">
                  <IconSoundCloud />
                </Link>
              </li>
              <li>
                <Link to="/products?movement=solar">
                  <IconZalo />
                </Link>
              </li>
            </ul>
            {/* Google Map Embed */}
            <div style={{ width: "100%", height: "400px", marginTop: "20px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.138790020525!2d106.67018357489687!3d10.799312958899569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752931cf58b19b%3A0x114d885f3f6f2bff!2sLandmark%2072!5e0!3m2!1sen!2s!4v1632023019834!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
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
