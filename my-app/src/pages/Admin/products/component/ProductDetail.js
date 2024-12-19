import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Box,
    Text,
    Img,
    Flex,
    Button,
    Spinner,
    useToast,
    Wrap,
    WrapItem,
    Heading,

} from "@chakra-ui/react";
import { fetchProductById } from "../../../../service/api/products";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const getProductDetail = async () => {
            setLoading(true);
            try {
                const data = await fetchProductById(id);
                setProduct(data);
            } catch (error) {
                toast({
                    title: "Lỗi khi tải chi tiết sản phẩm",
                    description: error.response?.data?.error || "Không thể tải sản phẩm.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        getProductDetail();
    }, [id, toast]);

    if (loading) {
        return (
            <Flex justify="center" align="center" height="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!product) {
        return (
            <Flex justify="center" align="center" height="100vh">
                <Text color="red.500" fontSize="lg">
                    Sản phẩm không tồn tại.
                </Text>
            </Flex>
        );
    }

    return (
        <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
            <Heading mb={5}>Chi tiết sản phẩm</Heading>
            <Flex direction={{ base: "column", md: "row" }}>
                <Box flexShrink={0} mb={{ base: 5, md: 0 }} mr={{ md: 5 }}>
                    <Wrap spacing={2}>
                        {product.images.split(",").map((url, index) => (
                            <WrapItem key={index}>
                                <Img
                                    src={`http://localhost:3000/uploads/products/${url}`}
                                    boxSize="200px"
                                    objectFit="cover"
                                    borderRadius="md"
                                    alt={`Hình ảnh ${index + 1}`}
                                />
                            </WrapItem>
                        ))}
                    </Wrap>
                </Box>
                <Box>
                    <Text fontSize="xl" fontWeight="bolder" mb={2}>
                        Tên sản phẩm: {product.name}
                    </Text>
                    <Text>Mô tả: {product.description}</Text>
                    <Text>Mô tả ngắn: {product.short_description}</Text>
                    <Text>
                        Giá:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(product.price)}
                    </Text>
                    <Text>Giới tính: {product.gender}</Text>
                    <Text>Loại: {product.category}</Text>
                    <Text>Chất liệu dây: {product.wire_material}</Text>
                    <Text>Đường kính mặt đồng hồ: {product.diameter} mm</Text>
                    <Text>Số lượng còn: {product.stock}</Text>
                    {/* <Text>Số lượt thích: {product.likes}</Text> */}
                </Box>
            </Flex>
            <Link to="/admin/products">
                <Button
                    mt={5}
                    bg="teal.500"
                    color="white"
                    _hover={{ bg: "teal.400" }}
                >
                    Quay lại danh sách
                </Button>
            </Link>
        </Box>
    );
};

export default ProductDetail;
