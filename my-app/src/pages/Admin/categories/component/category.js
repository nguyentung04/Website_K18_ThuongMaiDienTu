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
} from "@chakra-ui/react";
import { fetchCategories, deleteCategory } from "../../../../service/api/Category";
import { Link } from "react-router-dom";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  const handleConfirmDelete = async () => {
    try {
      if (selectedCategory) {
        await deleteCategory(selectedCategory.id);
        setCategories((prevData) =>
          prevData.filter((category) => category.id !== selectedCategory.id)
        );
        toast({
          title: "Category deleted.",
          description: "Category has been deleted successfully.",
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
        <Text fontSize="2xl" fontWeight="bold"></Text>
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
          <Th>stt</Th>
            <Th display="none">ID</Th>
            <Th>Category</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category, index) => (
            <Tr key={category.id} _hover={{ bg: hoverBgColor }}>
              <Td  fontWeight="bold">{index + 1}</Td>
              <Td display="none">{category.id}</Td>
              <Td>{category.name}</Td>
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
            Bạn có chắc chắn muốn xóa người dùng này không?
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
