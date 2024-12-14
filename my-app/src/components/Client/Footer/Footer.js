/* eslint-disable jsx-a11y/iframe-has-title */
import React ,{useEffect} from "react";
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
  useEffect(() => {
    // Thêm script của Dialogflow vào DOM
    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script khi component bị unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <footer className="footer">
      <div className="footer-links">
        <div className="content">
          {/* Cột 1: Trợ giúp khách hàng */}
          <div className="section">
            <span>Trợ giúp khách hàng</span>
            <hr />
            <ul>
              <li><Link to="/about-us">Giới thiệu về ......</Link></li>
              <li><Link to="/feedback">Phản ánh - khiếu nại</Link></li>
              <li><Link to="/agency-certification">Chứng nhận đại lý</Link></li>
              <li><Link to="/company-news">Tin tức công ty</Link></li>
              <li><Link to="/watch-knowledge">Kiến thức đồng hồ</Link></li>
            </ul>
          </div>

          {/* Cột 2: Chính sách chung */}
          <div className="section">
            <span>Chính sách chung</span>
            <hr />
            <ul>
              <li><Link to="/payment-terms">Điều khoản thanh toán</Link></li>
              <li><Link to="/warranty-policy">Chính sách bảo hành</Link></li>
              <li><Link to="/privacy-policy">Chính sách bảo mật</Link></li>
              <li><Link to="/shipping-policy">Chính sách vận chuyển</Link></li>
              <li><Link to="/return-policy">Chính sách đổi trả</Link></li>
              <li><Link to="/repair-warranty">Bảo hành & sửa chữa đồng hồ</Link></li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ hỗ trợ */}
          <div className="section">
            <span>LIÊN HỆ HỖ TRỢ</span>
            <hr />
            <ul>
              <li>
                <Link to="/contact">
                  <span>Tư vấn mua hàng:</span> 1800 0091
                </Link>
              </li>
              <li>
                <Link to="/support">
                  <span>Hỗ trợ kỹ thuật:</span> 1800 0092
                </Link>
              </li>
              <li>
                <Link to="/store-locator">
                  <span>Hệ thống cửa hàng:</span> Xem tại đây
                </Link>
              </li>
              <li>
                <Link to="/faq">
                  <span>Câu hỏi thường gặp:</span> Xem thêm
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Theo dõi chúng tôi */}
          <div className="section">
            <span>Theo dõi chúng tôi tại</span>
            <hr />
            <ul style={{ display: "flex", justifyContent: "space-around" }}>
              <li><Link to="/facebook"><IconFacebook /></Link></li>
              <li><Link to="/instagram"><IconInstagram /></Link></li>
              <li><Link to="/zalo"><IconZalo /></Link></li>
              <li><Link to="/soundcloud"><IconSoundCloud /></Link></li>
              <li><Link to="/contact"><IconPhone /></Link></li>
            </ul>

            {/* Google Map */}
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

      {/* Footer copy-right */}
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} DHB & FPoly. All Rights Reserved.
      </div>

       {/* Dialogflow Messenger */}
       <df-messenger
        intent="WELCOME"
        chat-title="Hỗ trợ khách hàng"
        agent-id="36b21e45-2d0c-4629-9ac7-833202734f69"
        language-code="vi"
      ></df-messenger>
    </footer>
  );
};

export default Footer;
