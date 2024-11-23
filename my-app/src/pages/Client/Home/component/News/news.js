import React, { useEffect, useState } from "react";
import "./news.css";
import axios from "axios";
import { fetchPosts } from "../../../../../service/api/posts"; // Ensure this imports correctly
import { useToast } from "@chakra-ui/react";
const BASE_URL = "http://localhost:3000";
// Helper function to truncate text if too long
const truncateText = (text, maxLength) => {
  if (!text) return ""; // Return an empty string if text is undefined
  return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
};

const NewsGrid = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toast = useToast();

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to fetch products.";
        setError(errorMessage);
        toast({
          title: "Lỗi khi tải sản phẩm",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [toast]);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="news-grid">
      <div className="row align-items-center">
        <div className="col fix-title uppercase">
          <h2>Kiến thức đồng hồ</h2>
        </div>
      </div>
      <div className="swiper-slide-news">
        <div className="news">
          {posts.map((news) => (
            <div className="news-card" key={news.id}>
              <div className="news-img">
                <img src={`${BASE_URL}/uploads/posts/${news.avt}`} alt={news.title} className="news-image" />
              </div>
              <div className="news-content">
                <div className="news-content-title">
                  <h4>{news.title}</h4>
                </div>
                <small className="news-content-time">
                  <p>{new Date(news.created_at).toLocaleDateString()}</p> {/* Format date */}
                  <p>{news.auth_name}</p>
                </small>
                <p>{truncateText(news.content, 100)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsGrid;
