import React from "react";
import "./news.css";

const newsItems = [
  {
    id: 1,
    title: "Lịch sử thương hiệu đồng hồ thời trang Christian Dior",
    date: "18/09/2024",
    author: "abc namen",
    summary:
      "Hành trình của đồng hồ Christian Dior từ những ngày đầu đến nay là một câu chuyện về sự phát triển không ngừng, về sự kết hợp hoàn hảo giữa...",
    image:
      "http://xn--nghttps-f7a6769d//th.bing.com/th/id/OIP.Cm2x8649lDO_5-5kjRu6CAHaHa?rs=1&pid=ImgDetMain",
  },
  {
    id: 2,
    title: "Lịch sử thương hiệu đồng hồ Chanel",
    date: "16/09/2024",
    author: "abc name",
    summary:
      "Cùng điểm qua những điều chưa biết về lịch sử đồng hồ Chanel nơi chúng và cách tạo nên bộ sưu tập nổi tiếng | J12 nổi riêng của thương hiệu...",
    image: "path_to_chanel_image.jpg",
  },
  {
    id: 3,
    title: "Lịch sử thương hiệu đồng hồ thời trang Christian Dior",
    date: "18/09/2024",
    author: "abc name",
    summary:
      "Hành trình của đồng hồ Christian Dior từ những ngày đầu đến nay là một câu chuyện về sự phát triển không ngừng, về sự kết hợp hoàn hảo giữa,Hành trình của đồng hồ Christian Dior từ những ngày đầu đến nay là một câu chuyện về sự phát triển không ngừng, về sự kết hợp hoàn hảo giữa...Hành trình của đồng hồ Christian Dior từ những ngày đầu đến nay là một câu chuyện về sự phát triển không ngừng, về sự kết hợp hoàn hảo giữa...Hành trình của đồng hồ Christian Dior từ những ngày đầu đến nay là một câu chuyện về sự phát triển không ngừng, về sự kết hợp hoàn hảo giữa...",
    image: "path_to_christian_dior_image.jpg",
  },

  // Add more news items...
];

// Hàm giúp rút gọn văn bản nếu nó quá dài
const truncateText = (text, maxLength) => {
  // Nếu độ dài của văn bản nhỏ hơn hoặc bằng giới hạn (maxLength), trả về toàn bộ văn bản
  if (text.length <= maxLength) return text;

  // Nếu độ dài của văn bản lớn hơn giới hạn, cắt văn bản đến giới hạn và thêm dấu "..."
  return text.substring(0, maxLength) + "...";
};

const NewsGrid = () => {
  return (
    <div className="news-grid">
      <div className="row align-items-center">
        <div className="col fix-title uppercase">
          <h2>Kiến thức đồng hồ</h2>
        </div>
      </div>
      <div className="swiper-slide-news">
        <div className="news">
          {newsItems.map((news) => (
            <div className="news-card" key={news.id}>
              <div className="news-img">
                <img src={news.image} alt={news.title} className="news-image" />
              </div>
              <div className="news-content">
                <div className="news-content-title">
                  <h4>{news.title}</h4>
                </div>
                <small className="news-content-time">
                  <p>{news.date}</p>
                  <p>{news.author}</p>
                </small>
                <p>{truncateText(news.summary, 100)}</p>{" "}
                {/* Truncate summary */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsGrid;
