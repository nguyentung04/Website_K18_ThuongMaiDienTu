import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
  Button,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { fetchOrderDetailById, updateOrderDetailStatus } from "../../../../service/api/order_detail"; 
import { deleteOrder } from '../../../../service/api/orders';

const OrderDetailTable = () => {
  const { orderId } = useParams(); 
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const headerBgColor = useColorModeValue("gray.200", "gray.800");

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
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
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
      <Table variant="simple">
        <Thead bg={headerBgColor}>
          <Tr>
            <Th>Order ID</Th> {/* Updated header */}
            <Th>Tên khách hàng</Th>
            <Th>Số điện thoại</Th>
            <Th>Địa chỉ</Th>
            <Th>Phương thức thanh toán</Th>
            <Th>Thời gian</Th>
            <Th>Item ID</Th> {/* Updated header */}
            <Th>Giá</Th>
            <Th>Số lượng</Th>
            <Th>Tổng</Th>
            <Th>Trạng thái</Th>
            <Th>Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orderDetails.map((item) => {
            console.log("Rendering Item:", item); // Debugging log
            return (
              <Tr key={item.id} _hover={{ bg: hoverBgColor }}>
                <Td>{item.order_id}</Td>
                <Td>{item.name}</Td>
                <Td>{item.phone}</Td>
                <Td>{item.address}</Td>
                <Td>{item.paymentMethod}</Td>
                <Td>{item.date}</Td>
                <Td>{item.id}</Td>
                <Td>{item.price}</Td>
                <Td>{item.quantity}</Td>
                <Td>{item.total}</Td>
                <Td>{item.statuss}</Td> {/* Updated property name */}
                <Td>
                  {item.statuss === "Chờ xác nhận" && (
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
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default OrderDetailTable;
