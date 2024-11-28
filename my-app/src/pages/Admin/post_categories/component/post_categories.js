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
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import {
  fetchPost_categories,
  deletePost_categories,
} from "../../../../service/api/post_categories";
import { Link } from "react-router-dom";

const CategoryPage = () => {
  const [post_categories, setPost_categories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();

  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số danh mục trên mỗi trang

  const [searchQuery, setSearchQuery] = useState(""); 
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchPost_categories();
      if (data) {
        setPost_categories(data);
      }
    };
    getCategories();
  }, []);

  const handleConfirmDelete = async () => {
    try {
      if (selectedCategory) {
        await deletePost_categories(selectedCategory.id);
        setPost_categories((prevData) =>
          prevData.filter((category) => category.id !== selectedCategory.id)
        );
        toast({
          title: "Thông báo",
          description: "Đã xóa 1 danh mục!!!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting category",
        description: "Failed to delete the category.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsOpen(false);
  };

  const onClose = () => setIsOpen(false);

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query !== "") {
      const filteredSuggestions = post_categories.filter((post_categories) =>
        post_categories.name.toLowerCase().includes(query)
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

  const filterePost_categories = post_categories.filter((post_categories) =>
    post_categories.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalItems = filterePost_categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentData = filterePost_categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Danh sách danh mục
          </Text>
          <Flex opacity={1}>
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
          <Button
            bg="#1ba43b"
            color="white"
            _hover={{ bg: "#189537" }}
            _active={{ bg: "#157f31" }}
          >
            Thêm danh mục
          </Button>
        </Link>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th display="none">ID</Th>
            <Th>Tên danh mục</Th>
            <Th>Mô tả</Th>
            <Th>Hoạt động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentData.map((post_categories, index) => (
            <Tr key={post_categories.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </Td>
              <Td display="none">{post_categories.id}</Td>
              <Td>{post_categories.name}</Td>
              <Td>{post_categories.description}</Td>
              <Td>
                <Link to={`edit/${post_categories.id}`}>
                  <Button colorScheme="blue" size="sm" mr={2}>
                    Sửa
                  </Button>
                </Link>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteClick(post_categories)}
                >
                  Xóa
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justify="center" mt={4}>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            size="sm"
            onClick={() => handlePageChange(index + 1)}
            bg={currentPage === index + 1 ? "blue.500" : "gray.300"}
            color={currentPage === index + 1 ? "white" : "black"}
            mx={1}
            _hover={{ bg: "blue.400" }}
          >
            {index + 1}
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
              Bạn có chắc chắn muốn xóa danh mục này không?
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

export default CategoryPage;
