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
import {
  fetchCategories,
  deleteCategory,
} from "../../../../service/api/Category";
import { Link } from "react-router-dom";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Quản lý trang hiện tại
  const categoriesPerPage = 5; // Số mục mỗi trang
  const cancelRef = useRef();
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      if (data) {
        setCategories(data);
      }
    };
    getCategories();
  }, []);

  // thanh tìm  kiếm
  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query !== "") {
      const filteredSuggestions = categories.filter((category) =>
        category.name.toLowerCase().includes(query)
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
  // =====================================================================
  const handleConfirmDelete = async () => {
    try {
      if (selectedCategory) {
        await deleteCategory(selectedCategory.id);
        setCategories((prevData) =>
          prevData.filter((category) => category.id !== selectedCategory.id)
        );
        toast({
          title: "Thông báo",
          description: "Đã xóa danh mục thành công!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Không thể xóa danh mục do danh mục này có chứa sản phẩm",
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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tính toán danh sách hiển thị dựa trên trang hiện tại
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Danh sách danh mục
          </Text>
          <Flex align="center" mb={4}>
            <Flex opacity={1}>
              <Input
                placeholder="Tìm kiếm tên danh mục..."
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
          </Flex>
        </Box>
        <Link to="admin/categories/add">
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
            <Th>Logo</Th>
            <Th>Tên danh mục</Th>
            <Th>Mô tả</Th>
            <Th>Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentCategories.map((category, index) => (
            <Tr key={category.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{indexOfFirstCategory + index + 1}</Td>
              <Td display="none">{category.id}</Td>
              <Td>
                <Img
                  src={`http://localhost:3000/uploads/categories/${category.logo}`}
                  boxSize="50px"
                  objectFit="cover"
                  borderRadius="full"
                  alt={category.name}
                />
              </Td>
              <Td>{category.name}</Td>
              <Td>{category.description}</Td>
              <Td>
                <Link to={`admin/Category/edit/${category.id}`}>
                  <Button colorScheme="blue" size="sm" mr={2}>
                    Sửa
                  </Button>
                </Link>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteClick(category)}
                >
                  Xóa
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* Phân trang */}
      <Flex justify="center" mt={4}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            mx={1}
            size="sm"
            onClick={() => handlePageChange(i + 1)}
            colorScheme={i + 1 === currentPage ? "blue" : "gray"}
          >
            {i + 1}
          </Button>
        ))}
      </Flex>
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
