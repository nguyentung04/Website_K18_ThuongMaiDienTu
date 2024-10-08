import React, { useState, useEffect } from "react";
import "./Slideshow.css";

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://curnonwatch.com/blog/wp-content/uploads/2021/03/anh-dong-ho-dep-76-1140x641.jpg",
    "https://cdn.mos.cms.futurecdn.net/StKASvzdkDmrZhAx4PBPXM-1024-80.jpg",
    "https://m.media-amazon.com/images/S/aplus-media/sc/82f2cd4d-69ec-4a41-9984-489aef216d47.__CR0,0,970,600_PT0_SX970_V1___.jpg",
  ];

  // Chuyển slide tự động
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Chuyển sau mỗi 3 giây

    return () => clearInterval(interval); // Khoảng thời gian xóa khi thành phần được ngắt kết nối
  }, [slides.length]);

  return (
    <div className="slideshow-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`mySlides ${index === currentSlide ? "active" : ""}`}
        >
          <img src={slide} alt={`Slide ${index + 1}`} className="slide-image" />
        </div>
      ))}

      <button
        className="prev"
        onClick={() =>
          setCurrentSlide((prevSlide) =>
            prevSlide === 0 ? slides.length - 1 : prevSlide - 1
          )
        }
      >
        &#10094;
      </button>
      <button
        className="next"
        onClick={() =>
          setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
        }
      >
        &#10095;
      </button>
    </div>
  );
};

export default Slideshow;
