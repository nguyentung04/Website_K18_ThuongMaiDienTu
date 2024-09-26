import React from "react";
import Slider from "react-slick";
import "./ImageSlider.css";
import { Autoplay } from "swiper/modules";

// Đường dẫn tới hình ảnh trong thư mục public
const images = [
  "/assets/slider2.jpg",
  "/assets/slider3.jpg",
  "/assets/slider4.png",
  // Thêm các hình ảnh khác nếu cần
];

const ImageSlider = () => {
  const settings = {
    autoplay: {
      delay: 1000, // Auto-switch every 2 seconds
      disableOnInteraction: false,
    },
    modules: [Autoplay],
    speed: 5000, // Faster transition speed,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="image-slider">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="slide">
            <a href="">
              <img src={image} alt={`Slide ${index + 1}`} />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
