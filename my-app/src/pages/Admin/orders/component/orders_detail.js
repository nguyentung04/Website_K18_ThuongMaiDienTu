import React, { useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";
import {
  fetchOrderDetailById,
  updateOrderDetailStatus,
} from "../../../../service/api/order_items";
import { deleteOrder } from "../../../../service/api/orders";

const OrderDetailTable = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await fetchOrderDetailById(orderId);
        setOrderDetails(data);
      } catch (error) {
        setError("Failed to fetch order details");
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleApprove = async (itemId) => {
    try {
      console.log(`Updating status for order ID: ${itemId}`);
      await updateOrderDetailStatus(itemId, "Đã xác nhận");
      setOrderDetails((prevDetails) =>
        prevDetails.map((item) =>
          item.order_id === itemId ? { ...item, statuss: "Đã xác nhận" } : item
        )
      );
      toast({
        title: "Đơn hàng đã được duyệt.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Có lỗi xảy ra.",
        description: "Không thể duyệt đơn hàng.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này không?"
    );
    if (confirmDelete) {
      try {
        console.log(`Cancelling order ID: ${itemId}`);
        await deleteOrder(itemId);
        setOrderDetails((prevDetails) =>
          prevDetails.filter((item) => item.order_id !== itemId)
        );
        toast({
          title: "Đơn hàng đã bị hủy.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error deleting order:", error);
        toast({
          title: "Có lỗi xảy ra.",
          description: "Không thể hủy đơn hàng.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
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
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Chi tiết đơn hàng #{orderId}
      </Text>
      {orderDetails.map((item) => (
        <Box
          key={item.id}
          mb={4}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          _hover={{ bg: hoverBgColor }}
        >
          <Box>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem colSpan={1}>
                <Text>
                  <strong>Tên khách hàng:</strong> {item.name}
                </Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Text>
                  <strong>Số điện thoại:</strong> {item.phone}
                </Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Text>
                  <strong>Địa chỉ:</strong> {item.shipping_address}
                </Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Text>
                  <strong>Phương thức thanh toán:</strong> {item.paymentMethod}
                </Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Text>
                  <strong>Thời gian:</strong> {item.created_at}
                </Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Text>
                  <strong>Giá:</strong> {formatCurrency(item.price)}
                </Text>
              </GridItem>
              <GridItem colSpan={1}>
                <Text>
                  <strong>Số lượng:</strong> {item.quantity}
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
            </Grid>
          </Box>{" "}
          <GridItem colSpan={1} className="d-flex flex-row-reverse">
            <Box>
              {item.status === "Chờ xác nhận" && (
                <Button
                  colorScheme="green"
                  size="sm"
                  margin="10px"
                  onClick={() => handleApprove(item.order_id)}
                >
                  Duyệt
                </Button>
              )}
              {item.status !== "Đã hủy" && (
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDelete(item.order_id)}
                >
                  Hủy đơn hàng
                </Button>
              )}
            </Box>
          </GridItem>
        </Box>
      ))}
    </Box>
  );
};

export default OrderDetailTable;
