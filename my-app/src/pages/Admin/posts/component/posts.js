import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Button,
  Flex,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Img, // Thêm Img để hiển thị logo
} from "@chakra-ui/react";
import { fetchPosts, deletePosts } from "../../../../service/api/posts";
import { Link } from "react-router-dom";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const getPosts = async () => {
      const data = await fetchPosts();
      if (data) {
        setPosts(data);
      }
    };
    getPosts();
  }, []);

  const handleConfirmDelete = async () => {
    try {
      if (selectedPosts) {
        await deletePosts(selectedPosts.id);
        setPosts((prevData) =>
          prevData.filter((post) => post.id !== selectedPosts.id)
        );
        toast({
          title: "Thông báo",
          description: "Đã xóa 1 bài viết!!!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi xóa bài viết",
        description: "Xóa bài viết thất bại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Failed to delete post:", error);
    }
    setIsOpen(false);
  };

  const onClose = () => setIsOpen(false);

  const handleDeleteClick = (post) => {
    setSelectedPosts(post);
    setIsOpen(true);
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Danh sách bài viết
        </Text>
        <Link to="add"> {/* Sửa đường dẫn */}
          <Button
            bg="#1ba43b"
            color="white"
            _hover={{ bg: "#189537" }}
            _active={{ bg: "#157f31" }}
          >
            Thêm bài viết
          </Button>
        </Link>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th display="none">ID</Th>
            <Th>Logo</Th> {/* Cột logo mới */}
            <Th>Tiêu đề</Th>
            <Th>Nội dung</Th>
            <Th>Lượt xem</Th>
            <Th>Danh mục</Th>
            <Th>Người đăng</Th>
            <Th>Hoạt động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {posts.map((post, index) => (
            <Tr key={post.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td display="none">{post.id}</Td>
              <Td>
                <Img
                  src={`http://localhost:3000/uploads/posts/${post.avt}`} // Đường dẫn đến logo
                  boxSize="50px" // Kích thước của logo
                  objectFit="cover"
                  borderRadius="full" // Làm tròn nếu muốn
                  alt={post.title}
                />
              </Td>
              <Td>{post.title}</Td>
              <Td maxW="200px" isTruncated>{post.content}</Td> {/* Hiển thị nội dung với độ dài giới hạn */}
              <Td>{post.views}</Td>
              <Td>{post.post_categories_id}</Td>
              <Td>{post.author_id}</Td>
              <Td>
                <Link to={`edit/${post.id}`}>
                  <Button colorScheme="blue" size="sm" mr={2}>
                    Sửa
                  </Button>
                </Link>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteClick(post)}
                >
                  Xóa
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận xóa
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa bài viết này không?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} colorScheme="blue">
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default PostsPage;
