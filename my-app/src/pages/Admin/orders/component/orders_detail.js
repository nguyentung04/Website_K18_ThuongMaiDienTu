import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Spinner,
  Button,
  useColorModeValue,
  useToast,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { fetchAdminOrderDetailById } from "../../../../service/api/order_items";

const OrderDetailTable = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await fetchAdminOrderDetailById(id);
        setOrderDetails(data);
      } catch (error) {
        setError("Failed to fetch order details");
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={5} bg="red.100" borderRadius="lg">
        <Text fontSize="lg" color="red.500">
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Box
        className="d-flex justify-content-between d-flex align-items-center"
        mb={4}
        fontWeight="bold"
      >
        <Text fontSize="2xl">Chi tiết đơn hàng #{id}</Text>

        <Button as={Link} to="/admin/orders" colorScheme="blue">
          Quay lại
        </Button>
      </Box>
      {orderDetails.map((item) => (
        <Box
          key={item.id}
          mb={4}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          _hover={{ bg: hoverBgColor }}
        >
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem colSpan={1}>
              <Text>
                <strong>Tên khách hàng:</strong> {item.name}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Số điện thoại:</strong> {item.userPhone}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Địa chỉ:</strong> {item.shipping_address}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Phương thức thanh toán:</strong> {item.payment_method}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Thời gian:</strong> {item.created_at}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Giá:</strong> {formatCurrency(item.product_price)}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Số lượng:</strong> {item.total_quantity}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Tổng:</strong> {formatCurrency(item.total_amount)}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Trạng thái:</strong> {item.status}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Nội dung hủy đơn :</strong> {item.shipping_address}
              </Text>
            </GridItem>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default OrderDetailTable;
