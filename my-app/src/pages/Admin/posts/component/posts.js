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
  Img,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import { fetchPosts, deletePosts } from "../../../../service/api/posts";
import { Link } from "react-router-dom";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số bài viết trên mỗi trang

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
    }
    setIsOpen(false);
  };

  const onClose = () => setIsOpen(false);

  const handleDeleteClick = (post) => {
    setSelectedPosts(post);
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query !== "") {
      const filteredSuggestions = posts.filter((post) =>
        post.title.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setSuggestions([]);
  };

  // Tính toán bài viết hiển thị trên trang hiện tại
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Danh sách bài viết
          </Text>
          <Flex>
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleInputChange}
              variant="outline"
              borderColor="#00aa9f"
              color="black"
              mr={2}
              width="200px"
            />
            {suggestions.length > 0 && (
              <List
                border="1px solid #ccc"
                borderRadius="md"
                bg="white"
                position="absolute"
                mt={2}
                width="200px"
              >
                {suggestions.map((suggestion) => (
                  <ListItem
                    key={suggestion.id}
                    p={2}
                    _hover={{ bg: "gray.200", cursor: "pointer" }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.title}
                  </ListItem>
                ))}
              </List>
            )}
          </Flex>
        </Box>
        <Link to="add">
          <Button bg="#1ba43b" color="white" _hover={{ bg: "#189537" }}>
            Thêm bài viết
          </Button>
        </Link>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Logo</Th>
            <Th>Tiêu đề</Th>
            <Th>Nội dung</Th>
            {/* <Th>Lượt xem</Th> */}
            <Th>ID danh mục</Th>
            <Th>Người đăng</Th>
            <Th>Hoạt động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentPosts.map((post, index) => (
            <Tr key={post.id} _hover={{ bg: hoverBgColor }}>
              <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
              <Td>
                <Img
                  src={`http://localhost:3000/uploads/posts/${post.avt}`}
                  boxSize="50px"
                  objectFit="cover"
                  borderRadius="full"
                  alt={post.title}
                />
              </Td>
              <Td>{post.title}</Td>
              <Td maxW="200px" isTruncated>
                {post.content}
              </Td>
              {/* <Td>{post.views}</Td> */}
              <Td>{post.post_categories_id}</Td>
              <Td>{post.auth_name}</Td>
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
      <Flex mt={4} justify="center">
        {[...Array(totalPages)].map((_, pageIndex) => (
          <Button
            key={pageIndex}
            mx={1}
            size="sm"
            onClick={() => handlePageChange(pageIndex + 1)}
            bg={currentPage === pageIndex + 1 ? "blue.500" : "gray.200"}
            color={currentPage === pageIndex + 1 ? "white" : "black"}
          >
            {pageIndex + 1}
          </Button>
        ))}
      </Flex>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận xóa
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa bài viết này không?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
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
