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
  ListItem, // Thêm Img để hiển thị logo
} from "@chakra-ui/react";
import { fetchPosts, deletePosts } from "../../../../service/api/posts";
import { Link } from "react-router-dom";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();

  //** ========================================================================================== */
  const [searchQuery, setSearchQuery] = useState(""); // Lưu chuỗi tìm kiếm
  const [suggestions, setSuggestions] = useState([]); // Lưu gợi ý quận/huyện

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

  //** ========================================================================================== */
  // Hàm xử lý sự kiện khi người dùng nhập vào ô tìm kiếm
  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Nếu chuỗi tìm kiếm không rỗng, lọc danh sách quận/huyện
    if (query !== "") {
      const filteredSuggestions = posts.filter((posts) =>
        posts.title.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Hàm xử lý khi người dùng chọn 1 gợi ý
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name); // Cập nhật chuỗi tìm kiếm với tên đã chọn
    setSuggestions([]); // Ẩn danh sách gợi ý sau khi chọn
  };

  // Filter cities based on search query
  const filtereposts = posts.filter((posts) =>
    posts.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Danh sách bài viết
          </Text>

          {/*  ===================================== thanh tìm kiếm ================================*/}

          {/* Input tìm kiếm */}
          <Flex opacity={1}>
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleInputChange} // Sửa lại hàm onChange
              variant="outline"
              borderColor="#00aa9f"
              color="black"
              mr={2}
              width="200px"
            />
            {/* Hiển thị gợi ý */}
            {suggestions.length > 0 && (
              <List
                border="1px solid #ccc"
                borderRadius="md"
                bg="white"
                // mt={2}
                position={"absolute"}
                marginTop={10}
                width="200px"
                paddingLeft={0}
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
          {" "}
          {/* Sửa đường dẫn */}
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
          {filtereposts.map((post, index) => (
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
              <Td maxW="200px" isTruncated>
                {post.content}
              </Td>{" "}
              {/* Hiển thị nội dung với độ dài giới hạn */}
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
