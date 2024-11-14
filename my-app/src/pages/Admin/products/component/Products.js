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
  List,
  ListItem,
} from "@chakra-ui/react";
import { fetchProducts, deleteProduct } from "../../../../service/api/products";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const cancelRef = useRef();
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const errorMessage = error.response?.data?.error || "Failed to fetch products.";
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

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query !== "") {
      const filteredSuggestions = products.filter((product) =>
        product.name.toLowerCase().includes(query)
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        title: "Lỗi xóa sản phẩm",
        description: "Không thể xóa sản phẩm.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsOpen(false);
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
        <Box>
          <Text fontSize="2xl" fontWeight="bold">Danh sách sản phẩm</Text>
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
                  zIndex={1000}
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
      {filteredProducts.length === 0 && <Text color="gray.500">Không có sản phẩm nào để hiển thị.</Text>}

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Ảnh</Th>
            <Th>Tên sản phẩm</Th>
            <Th>Loại sản phẩm</Th>
            <Th>Giá (VNĐ)</Th>
            <Th>Hoạt động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredProducts.map((product, index) => (
            <Tr key={product.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td>
                <Img
                  src={`http://localhost:3000/uploads/products/${product.images}`}
                  width="100px"
                  height="100px"
                  objectFit="cover"
                  borderRadius="22px"
                  alt={product.name}
                />
              </Td>
              <Td>{product.name}</Td>
              <Td>{product.category}</Td>
              <Td>{formatCurrency(product.price)}</Td>
              <Td>
                <Link to={`admin/products/edit/${product.id}`}>
                  <Button colorScheme="blue" size="sm" mr={2}>Sửa</Button>
                </Link>
                <Button colorScheme="red" size="sm" onClick={() => handleDeleteClick(product)}>Xóa</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProductsTable;
