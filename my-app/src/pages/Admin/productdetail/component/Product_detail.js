import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
} from "@chakra-ui/react"; // Chakra UI components
import "./ProductDetails.css"; // Import CSS file
import { fetchProductDetail } from "../../../../service/api/product_detail";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams(); // Get product ID from URL params
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const navigate = useNavigate(); // Using useNavigate to redirect

  const [searchQuery, setSearchQuery] = useState(""); // Lưu chuỗi tìm kiếm
  const [suggestions, setSuggestions] = useState([]); // Lưu gợi ý quận/huyện

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductDetail(id); // Fetch product detail by ID
        if (data) {
          setProduct(data); // Set single product object
        }
      } catch (error) {
        toast({
          title: "Error fetching product",
          description: "Failed to fetch product details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Failed to fetch product:", error);
      }
    };
    getProduct();
  }, [id, toast]); // Add id and toast as dependencies

  if (!product) {
    return <Text>Loading...</Text>; // Handle loading state
  }
  //** ========================================================================================== */
  // Hàm xử lý sự kiện khi người dùng nhập vào ô tìm kiếm
  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Nếu chuỗi tìm kiếm không rỗng, lọc danh sách quận/huyện
    if (query !== "") {
      const filteredSuggestions = product.filter((product) =>
        product.name.toLowerCase().includes(query)
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

  // Filter cities based on search query
  const filteredproduct = product.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="product-details" w={"100%"}>
      <Flex className="product-details" w={"100%"}>
        {/* Product Image */}
        <Box w={"100%"}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"} // Corrected alignitems to alignItems
          >
            <Text as="h2" size="lg" mb="4">
              Thông tin sản phẩm
            </Text>
            <Link to="admin/productsdetail/add">
              <Button
                bg="#1ba43b"
                color="white"
                _hover={{ bg: "#189537" }}
                _active={{ bg: "#157f31" }}
              >
                Thêm
              </Button>
            </Link>
          </Box>
        </Box>
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
                zIndex={10}
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
        {filteredproduct.map((product) => (
          <Flex
            key={product.id}
            _hover={{ bg: hoverBgColor }}
            className="product-details"
          >
            <Flex gap="4">
              <Box className="product-image">
                <Image
                  w={350}
                  h={350}
                  src={`http://localhost:3000/uploads/products/${product.image}`}
                  alt={product.name}
                  className="product-image img"
                />
              </Box>

              {/* Product Information */}
              <Grid templateColumns="repeat(2, 1fr)" gap="4">
                <Box className="product-info">
                  <Grid templateColumns="repeat(1, 1fr)" gap="4">
                    <Flex className="product-info-item">
                      <Text whiteSpace={"nowrap"} fontWeight="bold">
                        Tên sản phẩm:
                      </Text>
                      <Text>{product.name}</Text>
                    </Flex>

                    <Flex className="product-info-item">
                      <Text whiteSpace={"nowrap"} fontWeight="bold">
                        Bộ sưu tập:
                      </Text>
                      <Text>{product.collection}</Text>
                    </Flex>

                    <Flex className="product-info-item">
                      <Text whiteSpace={"nowrap"} fontWeight="bold">
                        Mô tả:
                      </Text>
                      <Text>{product.description}</Text>
                    </Flex>

                    <Grid templateColumns="repeat(2, 1fr)" gap="4">
                      <Flex className="product-info-item">
                        <Text whiteSpace={"nowrap"} fontWeight="bold">
                          Loại:
                        </Text>
                        <Text>{product.category}</Text>
                      </Flex>

                      <Flex className="product-info-item">
                        <Text whiteSpace={"nowrap"} fontWeight="bold">
                          Giới tính:
                        </Text>
                        <Text>{product.gender}</Text>
                      </Flex>

                      <Flex className="product-info-item">
                        <Text whiteSpace={"nowrap"} fontWeight="bold">
                          Màu:
                        </Text>
                        <Text>{product.color}</Text>
                      </Flex>

                      <Flex className="product-info-item">
                        <Text whiteSpace={"nowrap"} fontWeight="bold">
                          Số lượng:
                        </Text>
                        <Text>{product.quantity}</Text>
                      </Flex>
                    </Grid>
                  </Grid>
                </Box>

                {/* Pricing */}
                <Box className="product-pricing">
                  <Grid templateColumns="repeat(1, 1fr)" gap="4">
                    <Flex className="product-info-item">
                      <Text whiteSpace={"nowrap"} fontWeight="bold">
                        Giá:
                      </Text>
                      <Text>
                        {product.price} {product.currency}
                      </Text>
                    </Flex>
                    <Flex className="product-info-item">
                      <Text whiteSpace={"nowrap"} fontWeight="bold">
                        SKU:
                      </Text>
                      <Text>{product.identification}</Text>
                    </Flex>
                  </Grid>

                  <Grid templateColumns="repeat(2 , 1fr)" gap="4">
                    <Flex className="product-info-item">
                      <Text whiteSpace={"nowrap"} fontWeight="bold">
                        Loại máy:
                      </Text>
                      <Text>{product.machineType}</Text>
                    </Flex>
                    <Flex className="product-info-item">
                      <Text whiteSpace={"nowrap"} fontWeight="bold">
                        Độ dầy:
                      </Text>
                      <Text>{product.thickness}</Text>
                    </Flex>
                    <Flex className="product-info-item">
                      <Text whiteSpace={"nowrap"} fontWeight="bold">
                        Loại dây:
                      </Text>
                      <Text>{product.wireMaterial}</Text>
                    </Flex>
                    <Flex className="product-info-item">
                      <Text whiteSpace={"nowrap"} fontWeight="bold">
                        Chống nước:
                      </Text>
                      <Text>{product.antiWater}</Text>
                    </Flex>
                  </Grid>
                </Box>
              </Grid>
            </Flex>
            <Link to={`admin/productsdetail/edit/${product.product_id}`}>
              <Button
                colorScheme="blue"
                size="sm"
                fontWeight={"bold"}
                fontSize={18}
                w={100}
                borderRadius={5}
              >
                Sửa
              </Button>
            </Link>{" "}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default ProductDetails;
