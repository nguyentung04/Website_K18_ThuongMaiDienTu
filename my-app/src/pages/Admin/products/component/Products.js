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
  Spinner,
} from "@chakra-ui/react";
import { fetchProducts, deleteProduct } from "../../../../service/api/products";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const data = await fetchProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to fetch products.";
        setError(errorMessage);
        toast({
          title: "Error fetching products",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [toast]);

  const onClose = () => setIsOpen(false);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
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
    }
    setIsOpen(false);
  };

  const calculateDiscountedPrice = (price, discountPercentage) => {
    if (discountPercentage && discountPercentage > 0 && discountPercentage <= 100) {
      return price - (price * (discountPercentage / 100));
    }
    return price;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

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

      {error && <Text color="red.500">{error}</Text>}

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th display="none">ID</Th>
            <Th>Ảnh</Th>
            <Th>Tên sản phẩm</Th>
            <Th>Loại sản phẩm</Th>
            <Th>Giá (VNĐ)</Th>
            <Th>Khuyến mãi (%)</Th>
            <Th>Giá sau khuyến mãi</Th>
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
                    src={`http://localhost:3000/uploads/products/${product.image_url}`}
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius={"22px"}
                    alt={product.name}
                  />
                </Box>
              </Td>
              <Td>
                <Text fontWeight="bold">{product.name}</Text>
              </Td>
              <Td>
                <Text>{product.category}</Text>
              </Td>
              <Td>
                <Text>{formatCurrency(product.price)}</Text>
              </Td>
              <Td>
                <Text>{Math.round(product.discountPrice)}%</Text>
              </Td>
              <Td>
                <Text>{formatCurrency(calculateDiscountedPrice(product.price, product.discountPrice))}</Text>
              </Td>
              <Td>
                <Text>{product.status}</Text>
              </Td>
              <Td>
                <Link to={`admin/products/edit/${product.id}`}>
                  <Button colorScheme="blue" size="sm" mr={2}>Sửa</Button>
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

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Xác nhận xóa</AlertDialogHeader>
            <AlertDialogBody>Bạn có chắc chắn muốn xóa sản phẩm này không?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>Hủy</Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>Xóa</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProductsTable;
