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
import { fetchPost_categories, deletePost_categories } from "../../../../service/api/post_categories";
import { Link } from "react-router-dom";

const CategoryPage = () => {
  const [post_categories, setPost_categories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

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
      console.error("Failed to delete category:", error);
    }
    setIsOpen(false);
  };

  const onClose = () => setIsOpen(false);
  
  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">Danh sách danh mục</Text>
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
          {post_categories.map((post_categories, index) => (
            <Tr key={post_categories.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
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
