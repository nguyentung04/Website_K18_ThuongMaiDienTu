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
  Input,
  List,
  ListItem,
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
   //** ========================================================================================== */
  const [searchQuery, setSearchQuery] = useState(""); // Lưu chuỗi tìm kiếm
  const [suggestions, setSuggestions] = useState([]); // Lưu gợi ý quận/huyện

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        console.log(data); // Kiểm tra log dữ liệu trả về từ API
        if (data) {
          setProducts(data);
        }
      } catch (error) {
        setError("Failed to fetch products.");
        toast({
          title: "Error fetching products",
          description: "Failed to fetch product list.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to fetch products:", error);
      }
      setLoading(false);
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
      console.error("Failed to delete product:", error);
    }
    setIsOpen(false); // Close the dialog
  };

  // Hàm tính toán giá sau khi trừ giá khuyến mãi
  const calculateDiscountedPrice = (price, discountPercentage) => {
    if (
      discountPercentage &&
      discountPercentage > 0 &&
      discountPercentage <= 100
    ) {
      const discountedPrice = price - price * (discountPercentage / 100);
      return discountedPrice;
    }
    return price; // Nếu không có khuyến mãi, trả về giá gốc
  };

  // Hàm format giá trị VNĐ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  //** ========================================================================================== */
  // Hàm xử lý sự kiện khi người dùng nhập vào ô tìm kiếm
  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Nếu chuỗi tìm kiếm không rỗng, lọc danh sách quận/huyện
    if (query !== "") {
      const filteredSuggestions = products.filter((products) =>
        products.name.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Hàm xử lý khi người dùng chọn 1 gợi ý
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name); // Cập nhật chuỗi tìm kiếm với tên đã chọn
    setSuggestions([]); // Ẩn danh sách gợi ý sau khi chọn
  };

  // Filter products based on search query
  const filteredproducts = products.filter((products) =>
    products.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
      <Flex mb={5} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Danh sách sản phẩm
        </Text>
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
 {/*  ===================================== thanh tìm kiếm ================================*/}
      <Flex align="center" mb={4}>
        {/* Input tìm kiếm */}
        <Flex opacity={1}>
          <Input
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleInputChange} // Sửa lại hàm onChange
            variant="outline"
            borderColor="#00aa9f"
            color="black"
            mr={2}
            width="200px"
          />
          {/* Hiển thị gợi ý */}
          {suggestions.length > 0 && (
            <List
              border="1px solid #ccc"
              borderRadius="md"
              bg="white"
              // mt={2}
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
            {/* <Th>Trạng thái</Th> */}
            <Th>Hoạt động</Th>
          </Tr>
        </Thead>
        <Tbody fontWeight="bold">
          {filteredproducts.map((product, index) => (
            <Tr key={product.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td display="none">{product.id}</Td>
              <Td>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Img
                    src={`http://localhost:3000/uploads/products/${product.image}`}
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius={"22px"}
                    alt={product.name}
                  />
                </Box>
              </Td>
              <Td>
                <Text>{product.name}</Text>
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
                <Text>
                  {formatCurrency(
                    calculateDiscountedPrice(
                      product.price,
                      product.discountPrice
                    )
                  )}
                </Text>
              </Td>
              {/* <Td>
                <Text>{product.status}</Text>
              </Td> */}
              <Td>
                <Box className="d-flex ">
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
                </Box>
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
