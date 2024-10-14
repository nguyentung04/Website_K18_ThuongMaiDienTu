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
import { fetchComments, updateCommentCounts } from "../../../../service/api/comments";
import { Link } from "react-router-dom";

const CommentPage = () => {
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const getComments = async () => {
      try {
        const data = await fetchComments();
        if (data) {
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    getComments();
  }, []);

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter suggestions based on product name
    if (query !== "") {
      const filteredSuggestions = comments.filter((comment) =>
        comment.name.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name); // Set search query to selected product name
    setSuggestions([]); // Clear suggestions after selection
  };

  // Filter comments based on the search query (product name only)
  const filteredComments = comments.filter((comment) =>
    comment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateCounts = async () => {
    try {
      await updateCommentCounts();
      const updatedComments = await fetchComments();
      setComments(updatedComments);
    } catch (error) {
      console.error("Error updating comment counts:", error);
    }
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Danh sách bình luận
        </Text>
        <Flex align="center">
          {/* Search Input */}
          <Input
            placeholder="Tìm kiếm theo tên sản phẩm..."
            value={searchQuery}
            onChange={handleInputChange}
            variant="outline"
            borderColor="#00aa9f"
            mr={2}
            width="300px"  // Increased width from 200px to 300px
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
              zIndex={10}
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
          <Button colorScheme="green" onClick={handleUpdateCounts}>
            Cập nhật tổng số
          </Button>
        </Flex>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>ID comment</Th>
            <Th>Họ tên khách hàng</Th>
            <Th>ID khách hàng</Th>
            <Th>Tên sản phẩm</Th>
            <Th>ID Sản phẩm</Th>
            <Th>Tổng</Th>
            <Th>Thời gian</Th>
            <Th>Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredComments.map((comment, index) => (
            <Tr key={comment.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td>{comment.id}</Td>
              <Td>{comment.fullname}</Td>
              <Td>{comment.user_id}</Td>
              <Td>{comment.name}</Td>
              <Td>{comment.product_id}</Td>
              <Td>{comment.count}</Td>
              <Td>{comment.created_at}</Td>
              <Td>
                <Link to={`admin/comments/${comment.id}`}>
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
