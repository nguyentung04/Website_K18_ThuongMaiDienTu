import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  Textarea,
  Select, // Import Select từ Chakra UI
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { addPosts } from "../../../../service/api/posts"; // Đảm bảo API này hoạt động đúng
import axios from "axios";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddPostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author_id, setAuthorId] = useState(""); // Giữ author_id
  const [post_categories_id, setPostCategoriesId] = useState("");
  const [views, setViews] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [post_categories, setCategories] = useState([]); // State để lưu danh sách danh mục
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");

  // Lấy author_id từ localStorage hoặc context
  useEffect(() => {
    const currentUserId = localStorage.getItem("userId"); // Lấy userId từ localStorage
    if (currentUserId) {
      setAuthorId(currentUserId); // Gán vào state author_id
    } else {
      toast({
        title: "Lỗi đăng nhập",
        description: "Vui lòng đăng nhập để tiếp tục.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login"); // Chuyển hướng người dùng nếu không tìm thấy userId
    }

    // Fetch danh sách danh mục từ API (không cần fetch người đăng nữa)
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get(
          `http://localhost:3000/api/post_categories`
        );
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };

    fetchCategories();
  }, [navigate, toast]);

  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Tiêu đề bài viết là bắt buộc.";
    if (!content) newErrors.content = "Nội dung bài viết là bắt buộc.";
    if (!author_id) newErrors.author = "Người đăng là bắt buộc.";
    if (!post_categories_id)
      newErrors.category = "Danh mục bài viết là bắt buộc.";
    if (!imageFile) newErrors.image = "Ảnh bài viết là bắt buộc.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Tạo FormData để tải lên hình ảnh
    const formData = new FormData();
    formData.append("file", imageFile);

    let imageUrl = "";

    try {
      // Gửi yêu cầu tải lên hình ảnh
      const response = await axios.post(
        `http://localhost:3000/api/upload/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      imageUrl = response.data.filePath;
    } catch (error) {
      toast({
        title: "Lỗi tải lên hình ảnh",
        description: "Không tải được hình ảnh.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Tạo object chứa dữ liệu bài viết cùng với đường dẫn ảnh
    const postsData = {
      avt: imageUrl,
      title,
      content,
      author_id,
      post_categories_id,
    };

    try {
      await addPosts(postsData); // Gọi API để thêm bài viết
      toast({
        title: "Thông báo",
        description: "Bài viết mới đã được thêm thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/posts");
    } catch (error) {
      console.error("Không thêm được bài viết:", error);
      toast({
        title: "Lỗi khi thêm bài viết.",
        description: "Không thêm được bài viết.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <Box p={5} bg={bgColor} borderRadius="lg" boxShadow="md">
      <Heading mb={5}>Thêm bài viết</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="title" mb={4} isInvalid={errors.title}>
          <FormLabel>Tiêu đề bài viết</FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề bài viết"
          />
          {errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage>}
        </FormControl>

        <FormControl id="content" mb={4} isInvalid={errors.content}>
          <FormLabel>Nội dung bài viết</FormLabel>
          <ReactQuill
          value={content}
            onChange={(value) => setContent(value)}
            placeholder="Nhập nội dung bài viết"
          />
          {errors.content && (
            <FormErrorMessage>{errors.content}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl id="category" mb={4} isInvalid={errors.category}>
          <FormLabel>Danh mục bài viết</FormLabel>
          <Select
            placeholder="Chọn danh mục"
            value={post_categories_id}
            onChange={(e) => setPostCategoriesId(e.target.value)}
          >
            {post_categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.category && (
            <FormErrorMessage>{errors.category}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl id="image" mb={4} isInvalid={errors.image}>
          <FormLabel>Ảnh bài viết</FormLabel>
          <Input type="file" onChange={handleImageChange} />
          {errors.image && <FormErrorMessage>{errors.image}</FormErrorMessage>}
        </FormControl>

        <Button colorScheme="teal" type="submit">
          Thêm bài viết
        </Button>
      </form>
    </Box>
  );
};

export default AddPostPage;
