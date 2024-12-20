import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useColorModeValue,
  Text,
  Spinner, // Import thêm Spinner để hiển thị trạng thái tải
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { fetchCancelledOrderDetails } from "../../../../service/api/order-cancelled";

const CancelledOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi

  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  // Fetch orders
  useEffect(() => {
    const getOrders = async () => {
      try {
        const fetchedData = await fetchCancelledOrderDetails();
        if (fetchedData) {
          setOrders(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false); // Kết thúc trạng thái tải
      }
    };
    getOrders();
  }, []);

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      {isLoading ? (
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" />
          <Text mt={3} fontSize="lg">
            Đang tải dữ liệu...
          </Text>
        </Box>
      ) : error ? (
        <Text fontSize="lg" color="red.500" textAlign="center">
          {error}
        </Text>
      ) : orders.length === 0 ? (
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Không có đơn hàng đã giao nào.
        </Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>STT</Th>
              <Th>Tên người nhận</Th>
              <Th>Địa chỉ</Th>
              <Th>Tỉnh</Th>
              <Th>Quận/Huyện</Th>
              <Th>Trạng thái</Th>
              <Th>Số lượng</Th>

              <Th>Phương thức thanh toán</Th>
              <Th>Chi tiết</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order, index) => (
              <Tr key={order.id} _hover={{ bg: hoverBgColor }}>
                <Td fontWeight="bold">{index + 1}</Td>
                <Td>{order.userName || "N/A"}</Td>{" "}
                {/* Cập nhật thuộc tính chính xác */}
                <Td>{order.shipping_address || "N/A"}</Td>
                <Td>{order.Provinces || "N/A"}</Td>
                <Td>{order.Districts || "N/A"}</Td>
                <Td>{order.orderStatus || "N/A"}</Td>
                <Td>{order.total_quantity || "N/A"}</Td>
                <Td>{order.payment_method || "N/A"}</Td>
                <Td>
                  <Link to={`/admin/orders/paid/order_items/${order.orderid}`}>
                    <Button colorScheme="blue" size="sm">
                      Chi tiết
                    </Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default CancelledOrder;
