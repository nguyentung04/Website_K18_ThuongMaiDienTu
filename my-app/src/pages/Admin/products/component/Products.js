


import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Img,
  Text,
  Button,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { fetchProducts, deleteProduct } from "../../../../service/api/products";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        if (data) {
          setProducts(data);
        }
      } catch (error) {
        toast({
          title: "Error fetching products",
          description: "Failed to fetch product list.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to fetch products:", error);
      }
    };
    getProducts();
  }, [toast]);

  const onClose = () => setIsOpen(false);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedProduct) {
        await deleteProduct(selectedProduct.id);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== selectedProduct.id)
        );
        toast({
          title: "Sản phẩm đã bị xóa.",
          description: "Sản phẩm đã được xóa thành công.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting product",
        description: "Failed to delete the product.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Failed to delete product:", error);
    }
    setIsOpen(false); // Close the dialog
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
      <Flex mb={5} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">Danh sách sản phẩm</Text>
        <Link to="admin/products/add">
          <Button
            bg="#1ba43b"
            color="white"
            _hover={{ bg: "#189537" }}
            _active={{ bg: "#157f31" }}
          >
            Thêm sản phẩm
          </Button>
        </Link>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th display="none">ID</Th>
            <Th>Ảnh</Th>
            <Th>Tên sản phẩm</Th>
            <Th>Loại sản phẩm</Th>
            <Th>Giá</Th>
            <Th>Trạng thái</Th>
            <Th>Hoạt động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product, index) => (
            <Tr key={product.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td display="none">{product.id}</Td>
              <Td>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Img
                    src={`http://localhost:3000/uploads/products/${product.image}`} // Sửa đường dẫn cho phù hợp với cấu hình server
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius={"22px"}
                    alt={product.name} // Cải thiện khả năng tiếp cận và kiểm tra
                  />
                </Box>
              </Td>
              <Td>
                <Box display="flex" alignItems="center">
                  <Box>
                    <Text fontWeight="bold">{product.name}</Text>
                  </Box>
                </Box>
              </Td>
              <Td>
                <Text>{product.category}</Text>
              </Td>
              <Td>
                <Text>{product.price}</Text>
              </Td>
              <Td>
                <Text>{product.status}</Text>
              </Td>
              <Td>
                <Link to={`admin/products/edit/${product.id}`}>
                  <Button colorScheme="blue" size="sm" mr={2}>
                    Sửa
                  </Button>
                </Link>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteClick(product)}
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
              Bạn có chắc chắn muốn xóa sản phẩm này không?
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

export default ProductsTable;

