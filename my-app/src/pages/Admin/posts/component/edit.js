import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  FormErrorMessage,
  useToast,
  Textarea,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchPostById,
  updatePosts,
} from "../../../../service/api/posts";
import axios from "axios";

const EditPostPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author_id, setAuthorId] = useState("");
  const [post_categories_id, setPostCategoriesId] = useState("");
  const [avt, setAvt] = useState(null);  // Track existing avatar
  const [imageFile, setImageFile] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const post = await fetchPostById(id);
        if (post) {
          setTitle(post.title || "");
          setContent(post.content || "");
          setAuthorId(post.author_id || "");
          setPostCategoriesId(post.post_categories_id || "");
          setAvt(post.avt || null);  // Set existing avatar
        } else {
          throw new Error("Post data is empty or undefined.");
        }

        const authorsResponse = await axios.get(`http://localhost:3000/api/users`);
        setAuthors(authorsResponse.data);

        const categoriesResponse = await axios.get(`http://localhost:3000/api/post_categories`);
        setCategories(categoriesResponse.data);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: error.message || "Không thể tải bài viết.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [id, toast]);

  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Tiêu đề bài viết là bắt buộc.";
    if (!content) newErrors.content = "Nội dung bài viết là bắt buộc.";
    if (!imageFile && !avt) newErrors.imageFile = "Ảnh là bắt buộc nếu bài viết chưa có ảnh.";
    if (!author_id) newErrors.author = "Người đăng là bắt buộc.";
    if (!post_categories_id) newErrors.category = "Danh mục bài viết là bắt buộc.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let imageUrl = avt || "";  // Default to existing avatar if no new image uploaded

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
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
    }

    const postsData = {
      avt: imageUrl,
      title,
      content,
      author_id,
      post_categories_id,
    };

    try {
      await updatePosts(id, postsData);
      toast({
        title: "Thông báo",
        description: "Bài viết đã được cập nhật thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/admin/posts");
    } catch (error) {
      toast({
        title: "Lỗi khi cập nhật bài viết.",
        description: error.message || "Không cập nhật được bài viết.",
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
      <Heading mb={5}>Chỉnh sửa bài viết</Heading>
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
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung bài viết"
          />
          {errors.content && <FormErrorMessage>{errors.content}</FormErrorMessage>}
        </FormControl>

        

        <FormControl id="category" mb={4} isInvalid={errors.category}>
          <FormLabel>Danh mục bài viết</FormLabel>
          <Select
            placeholder="Chọn danh mục"
            value={post_categories_id}
            onChange={(e) => setPostCategoriesId(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.category && <FormErrorMessage>{errors.category}</FormErrorMessage>}
        </FormControl>

        <FormControl id="image" mb={4} isInvalid={errors.imageFile}>
          <FormLabel>Ảnh bài viết</FormLabel>
          <Input type="file" onChange={handleImageChange} />
          {errors.imageFile && <FormErrorMessage>{errors.imageFile}</FormErrorMessage>}
        </FormControl>

        <Button colorScheme="teal" type="submit">
          Cập nhật bài viết
        </Button>
      </form>
    </Box>
  );
};

export default EditPostPage;