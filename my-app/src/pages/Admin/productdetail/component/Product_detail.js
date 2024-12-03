import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Flex,
  Grid,
  useColorModeValue,
  useToast,
  Button,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import "./ProductDetails.css";
import {
  fetchProductDetailById,
  fetchProductDetails,
} from "../../../../service/api/product_detail";

const ProductDetails = () => {
  const [product, setProduct] = useState([]);
  const { id } = useParams();
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getProductDetails = useCallback(async () => {
    try {
      const data = id
        ? [await fetchProductDetailById(id)]
        : await fetchProductDetails();
      setProduct(data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin sản phẩm.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error fetching product:", error);
    }
  }, [id, toast]);

  useEffect(() => {
    getProductDetails();
  }, [getProductDetails]);

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filteredSuggestions = query
      ? product.filter((item) =>
          item.name.toLowerCase().includes(query)
        )
      : [];
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    navigate(`/admin/productsdetail/${suggestion.product_id}`);
    setSuggestions([]);
  };

  const filteredProducts = product.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <Box className="product-details" w="100%">
      <Flex w="100%" flexDirection="column">
        <Box w="100%" mb={4}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text as="h2" fontSize="2xl">
              Thông tin sản phẩm
            </Text>
            {/* <Link to="/admin/productsdetail/add">
              <Button bg="#1ba43b" color="white" _hover={{ bg: "#189537" }}>
                Thêm
              </Button>
            </Link> */}
          </Flex>
        </Box>

        <Flex align="center" mb={4}>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={handleInputChange}
            variant="outline"
            borderColor="#00aa9f"
            color="black"
            width="300px"
            mr={2}
          />
          {suggestions.length > 0 && (
            <List
              border="1px solid #ccc"
              borderRadius="md"
              bg="white"
              mt={2}
              width="300px"
              position="absolute"
              zIndex={10}
            >
              {suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.product_id}
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

        {currentProducts.map((product) => (
          <Flex
            key={product.product_id}
            _hover={{ bg: hoverBgColor }}
            p={4}
            border="1px solid #e2e8f0"
            borderRadius="md"
            mb={4}
            alignItems="center"
          >
            <Image
              w={150}
              h={150}
              src={`http://localhost:3000/uploads/products/${product.image_url}`}
              alt={product.name}
              mr={4}
            />
            <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
              <Box>
                <Text fontWeight="bold">Tên sản phẩm: {product.name}</Text>
                <Text fontWeight="bold">Mô tả: {product.description}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Giá: {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Text>
                <Text fontWeight="bold">Loại: {product.category}</Text>
              </Box>
            </Grid>
            <Link to={`/admin/productsdetail/edit/${product.product_id}`}>
              <Button colorScheme="blue" size="sm" ml={4} fontWeight="bold">
                Sửa
              </Button>
            </Link>
          </Flex>
        ))}

        <Flex justifyContent="center" mt={4}>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              colorScheme={currentPage === i + 1 ? "teal" : "gray"}
              mx={1}
            >
              {i + 1}
            </Button>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ProductDetails;

