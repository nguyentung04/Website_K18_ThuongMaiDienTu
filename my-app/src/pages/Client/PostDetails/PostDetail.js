import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostDetail } from "../../../service/api/posts";
import { useToast } from "@chakra-ui/react";
import "./PostDetail.css";

const BASE_URL = "http://localhost:3000";

const PostDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toast = useToast();

  useEffect(() => {
    const getPostDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPostDetail(id);
        setPost(data);
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to fetch post details.";
        setError(errorMessage);
        toast({
          title: "Lỗi khi tải bài viết",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    getPostDetail();
  }, [id, toast]);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!post) {
    return <p>Không tìm thấy bài viết</p>;
  }

  return (
    <div className="post-detail">
      <div className="post-header">
        <h1>{post.title}</h1>
        <small>
          {new Date(post.created_at).toLocaleDateString()}  {post.auth_name}
        </small>
      </div>
      <div className="post-image">
        <img src={`${BASE_URL}/uploads/posts/${post.avt}`} alt={post.title} />
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default PostDetail;
