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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { fetchOrdersPaid } from "../../../../service/api/orders"; // Import service functions

const PaidTable = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  // Fetch orders
  useEffect(() => {
    const getOrders = async () => {
      try {
        const fetchedData = await fetchOrdersPaid();
        if (fetchedData) {
          setOrders(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false); // Dừng trạng thái tải
      }
    };
    getOrders();
  }, []);

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      {isLoading ? ( // Hiển thị thông báo tải dữ liệu
        <Text>Đang tải dữ liệu...</Text>
      ) : orders.length === 0 ? ( // Hiển thị thông báo nếu không có dữ liệu
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Không có đơn hàng đã thanh toán nào.
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
              <Th> Số lượng</Th>
              <Th>Phương thức thanh toán</Th>
              <Th>Chi tiết</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order, index) => (
              <Tr key={order.orderid} _hover={{ bg: hoverBgColor }}>
                <Td fontWeight="bold">{index + 1}</Td>
                <Td>{order.userName}</Td>
                <Td>{order.shipping_address}</Td>
                <Td>{order.Districts}</Td>
                <Td>{order.Provinces}</Td>
                <Td>{order.orderStatus}</Td>
                <Td>{order.total_quantity}</Td>
                <Td>{order.payment_method}</Td>
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

export default PaidTable;
