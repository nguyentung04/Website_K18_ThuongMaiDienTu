import React, { useEffect, useState } from "react";
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
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import { fetchProductReviews, updateProductReviewCounts } from "../../../../service/api/comments";
import { Link } from "react-router-dom";

const CommentPage = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage] = useState(10); // Số lượng đánh giá mỗi trang
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const getReviews = async () => {
      try {
        const data = await fetchProductReviews();
        if (data) {
          setReviews(data);
        }
      } catch (error) {
        console.error("Error fetching product reviews:", error);
      }
    };
    getReviews();
  }, []);

  const handleUpdateCounts = async () => {
    try {
      await updateProductReviewCounts();
      const updatedReviews = await fetchProductReviews();
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Error updating product review counts:", error);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query !== "") {
      const filteredSuggestions = reviews.filter((review) =>
        review.name?.toLowerCase().includes(query)
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

  const filteredReviews = reviews.filter((review) =>
    review.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lấy dữ liệu cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Danh sách đánh giá sản phẩm
          </Text>
          <Flex align="center" mb={4}>
            <Flex opacity={1}>
              <Input
                placeholder="Tìm kiếm tên sản phẩm..."
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
                      {suggestion.name}
                    </ListItem>
                  ))}
                </List>
              )}
            </Flex>
            <Button
              fontFamily="math"
              variant="solid"
              colorScheme="teal"
              bg="#00aa9f"
              _hover={{ bg: "#32dfd4" }}
              mr={4}
            >
              Tìm kiếm
            </Button>
          </Flex>
        </Box>
        <Button colorScheme="green" onClick={handleUpdateCounts}>
          Cập nhật tổng số
        </Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Họ tên khách hàng</Th>
            <Th>ID khách hàng</Th>
            <Th>Tên sản phẩm</Th>
            <Th>ID sản phẩm</Th>
            <Th>Thời gian</Th>
            <Th>Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentReviews.map((review, index) => (
            <Tr key={review.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{indexOfFirstItem + index + 1}</Td>
              <Td>{review.fullname}</Td>
              <Td>{review.user_id}</Td>
              <Td>{review.name}</Td>
              <Td>{review.product_id}</Td>
              <Td>{review.created_at}</Td>
              <Td>
                <Link to={`admin/comments/${review.id}`}>
                  <Button colorScheme="blue" size="sm" mr={2}>
                    Chi tiết
                  </Button>
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* Phân trang */}
      <Flex justify="center" mt={5}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            mx={1}
            colorScheme={page === currentPage ? "blue" : "gray"}
          >
            {page}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};

export default CommentPage;
