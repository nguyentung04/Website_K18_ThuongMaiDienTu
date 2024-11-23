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
import {
  fetchProductReviews,
  updateProductReviewCounts,
} from "../../../../service/api/comments";
import { Link } from "react-router-dom";

const CommentPage = () => {
  const [reviews, setReviews] = useState([]);
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

    // Tìm kiếm dựa trên tên sản phẩm
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
    setSearchQuery(suggestion.name); // Hiển thị tên sản phẩm đã chọn
    setSuggestions([]);
  };

  // Lọc danh sách đánh giá dựa trên tên sản phẩm
  const filteredReviews = reviews.filter((review) =>
    review.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Th display={"none"}>ID khách hàng</Th>
            <Th>Tên sản phẩm</Th> 
            <Th display={"none"}>ID sản phẩm</Th>
            <Th>Thời gian</Th>
            <Th>Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredReviews.map((review, index) => (
            <Tr key={review.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td>{review.fullname}</Td>
              <Td display={"none"}>{review.user_id}</Td>
              <Td>{review.name}</Td>
              <Td display={"none"}>{review.product_id}</Td>
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
    </Box>
  );
};

export default CommentPage;
