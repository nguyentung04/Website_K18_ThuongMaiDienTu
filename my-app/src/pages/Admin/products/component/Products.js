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
  Input,
} from "@chakra-ui/react";
import { fetchProducts, deleteProduct } from "../../../../service/api/products";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5; // Số sản phẩm trên mỗi trang
  const cancelRef = useRef();
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  // Lấy danh sách sản phẩm
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Lỗi khi tải sản phẩm.";
        setError(errorMessage);
        toast({
          title: "Lỗi khi tải sản phẩm",
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

  // Tìm kiếm sản phẩm
  const handleInputChange = (e) => setSearchQuery(e.target.value);

  // Sản phẩm sau khi tìm kiếm
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý xóa
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      setProducts((prev) =>
        prev.filter((product) => product.id !== selectedProduct.id)
      );
      toast({
        title: "Sản phẩm đã bị xóa.",
        description: `Sản phẩm "${selectedProduct.name}" đã được xóa thành công.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Lỗi xóa sản phẩm",
        description: error.response?.data?.error || "Không thể xóa sản phẩm.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsOpen(false);
    }
  };

  // Định dạng tiền tệ
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  // Nếu đang tải
  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Danh sách sản phẩm
          </Text>
          <Input
            placeholder="Tìm kiếm tên sản phẩm..."
            value={searchQuery}
            onChange={handleInputChange}
            variant="outline"
            borderColor="#00aa9f"
            color="black"
            mt={2}
            width="200px"
          />
        </Box>
        <Link to="admin/products/add">
          <Button bg="#1ba43b" color="white" _hover={{ bg: "#189537" }}>
            Thêm sản phẩm
          </Button>
        </Link>
      </Flex>

      {error && <Text color="red.500">{error}</Text>}
      {paginatedProducts.length === 0 && (
        <Text color="gray.500">Không có sản phẩm nào để hiển thị.</Text>
      )}

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th textAlign="center">STT</Th>
            <Th textAlign="center">Ảnh</Th>
            <Th textAlign="center">Tên sản phẩm</Th>
            <Th textAlign="center">Loại sản phẩm</Th>
            <Th textAlign="center">Giá (VNĐ)</Th>
            <Th textAlign="center">Hoạt động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedProducts.map((product, index) => (
            <Tr key={product.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold" textAlign="center">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </Td>
              <Td textAlign="center">
                <Img
                  src={`http://localhost:3000/uploads/products/${product.images}`}
                  width="100px"
                  height="100px"
                  objectFit="cover"
                  borderRadius="22px"
                  alt={product.name}
                  display="block"
                  margin="auto"
                />
              </Td>
              <Td textAlign="center">{product.name}</Td>
              <Td textAlign="center">{product.category}</Td>
              <Td textAlign="center">{formatCurrency(product.price)}</Td>
              <Td textAlign="center">
                <Flex justifyContent="center" gap={2}>
                  <Link to={`admin/products/edit/${product.id}`}>
                    <Button
                      bg="blue.500"
                      color="white"
                      size="sm"
                      _hover={{ bg: "blue.400" }}
                    >
                      Sửa
                    </Button>
                  </Link>
                  <Button
                    bg="red.500"
                    color="white"
                    size="sm"
                    _hover={{ bg: "red.400" }}
                    onClick={() => handleDeleteClick(product)}
                  >
                    Xóa
                  </Button>
                  <Link to={`admin/products/detail/${product.id}`}>
                    <Button
                      bg="teal.500"
                      color="white"
                      size="sm"
                      _hover={{ bg: "teal.400" }}
                    >
                      Chi tiết
                    </Button>
                  </Link>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>


      <Flex justifyContent="center" mt={4}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => setCurrentPage(page)}
            bg={page === currentPage ? "#00aa9f" : "gray.200"}
            color={page === currentPage ? "white" : "black"}
            _hover={{ bg: "#32dfd4" }}
            mx={1}
          >
            {page}
          </Button>
        ))}
      </Flex>

      {/* AlertDialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa sản phẩm
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
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