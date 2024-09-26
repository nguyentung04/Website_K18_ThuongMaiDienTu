import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "./logoSlider.css"; // Ensure your CSS styles the elements as needed
import { Autoplay } from "swiper/modules";

const SliderBrand = () => {
  return (
    <div className="container slider-brand">
      <div className="row align-items-center">
        <div className="col fix-title uppercase">
          <h2 className="slider-title">Đồng hồ Hiệu</h2>{" "}
          {/* Styled as centered and with decorative lines */}
        </div>
      </div>

      <Swiper
      
          modules={[Autoplay]}
        slidesPerView={5} // Display 5 logos at a time
        spaceBetween={50} // Increase space between slides for better visibility
        loop={true} // Enable looping
        autoplay={{
          delay: 1000, // Auto-switch every 2 seconds
          disableOnInteraction: false,
        }}
        speed={5000} // Faster transition speed
        className="logo-swiper" // Custom class for additional styling
        style={{
          display: "flex",
          overflow: "hidden",
          paddingTop: "30px",
        }}
      >
        {/* Swiper Slides */}
        <SwiperSlide>
          <a href="/dong-ho-chopard-454.aspx" title="Chopard">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/chopard-luxshopping-20231.png.webp"
              width="180"
              height="90"
              alt="Chopard"
              className="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>

        <SwiperSlide style={{ display: "flex" }}>
          <a href="/dong-ho-omega-467.aspx" title="Omega">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/luxshoppingvn6-1.png.webp"
              width="180px"
              height="90px"
              alt="Omega"
              className="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>

        <SwiperSlide style={{ width: "248px" }}>
          <a href="/dong-ho-zenith-479.aspx" title="Zenith">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/luxury-shoping1-1.png.webp"
              width="180"
              height="90"
              alt="Zenith"
              class="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>

        <SwiperSlide style={{ width: "248px" }}>
          {" "}
          <a href="/dong-ho-omega-467.aspx" title="Omega">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/luxshoppingvn6-1.png.webp"
              width="180"
              height="90"
              alt="Omega"
              class="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>

        <SwiperSlide style={{ width: "248px" }}>
          <a href="/dong-ho-patek-philippe-489.aspx" title="Patek Philippe">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/patek-philippe-logo1-1.png.webp"
              width="180"
              height="90"
              alt="Patek Philippe"
              class="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>
        <SwiperSlide style={{ width: "248px" }}>
          <a
            href="/dong-ho-vacheron-constantin-519.aspx"
            title="Vacheron Constantin"
          >
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/vacheron-constantin-luxshopping2-0.png.webp"
              width="180"
              height="90"
              alt="Vacheron Constantin"
              class="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>

        <SwiperSlide style={{ width: "248px" }}>
          <a href="/dong-ho-bvlgari-517.aspx" title="BVLGARI">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/bvl-luxshopping1-1.png.webp"
              width="180"
              height="90"
              alt="BVLGARI"
              class="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>

        <SwiperSlide style={{ width: "248px" }}>
          <a href="/dong-ho-cartier-503.aspx" title="CARTIER">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/cartier-luxshopping4.png.webp"
              width="180"
              height="90"
              alt="CARTIER"
              class="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>

        <SwiperSlide style={{ width: "248px" }}>
          <a href="/dong-ho-christian-dior-504.aspx" title="Christian Dior">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/dior-luxshopping1-1.png.webp"
              width="180"
              height="90"
              alt="Christian Dior"
              class="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>

        <SwiperSlide style={{ width: "248px" }}>
          <a href="/dong-ho-hublot-509.aspx" title="Hublot">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/hublot-luxshopping2-1.png.webp"
              width="180"
              height="90"
              alt="Hublot"
              class="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>

        <SwiperSlide style={{ width: "248px" }}>
          <a href="/dong-ho-tag-heuer-449.aspx" title="Tag Heuer">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/tag-heuer-9.png.webp"
              width="180"
              height="90"
              alt="Tag Heuer"
              class="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>

        <SwiperSlide style={{ width: "248px" }}>
          <a href="/dong-ho-longines-451.aspx" title="Longines">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/logo-longines-full.png.webp"
              width="180"
              height="90"
              alt="Longines"
              class="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>

        <SwiperSlide style={{ width: "248px" }}>
          <a href="/dong-ho-burberry-468.aspx" title="Burberry">
            <img
              src="https://cdn.luxshopping.vn/Thumnails/Uploads/Images/luxury-shopping-watch1-1.png.webp"
              width="180"
              height="90"
              alt="Burberry"
              class="img-fluid"
              loading="lazy"
            />
          </a>
        </SwiperSlide>
        {/* Add more slides as needed */}
      </Swiper>
    </div>
  );
};

export default SliderBrand;
