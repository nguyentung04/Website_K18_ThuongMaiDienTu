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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { fetchOrders, deleteOrder } from "../../../../service/api/orders"; // Import service functions

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  // Lấy danh sách đơn hàng
  useEffect(() => {
    const getOrders = async () => {
      try {
        const fetchedData = await fetchOrders();
        if (fetchedData) {
          setOrders(fetchedData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      }
    };
    getOrders();
  }, []);

  // Hàm xử lý xóa đơn hàng
  const handleDeleteOrder = async (id) => {
    try {
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?");
      if (confirmDelete) {
        await deleteOrder(id);
        setOrders(orders.filter(order => order.id !== id)); // Cập nhật lại danh sách đơn hàng
      }
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
    }
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Tên người nhận</Th>
            <Th>Địa chỉ</Th>
            <Th>Tỉnh</Th>
            <Th>Quận/Huyện</Th>
            <Th>Số điện thoại</Th>
            <Th>Phương thức thanh toán</Th>
            <Th>Chi tiết</Th>
            <Th>Xóa</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order, index) => (
            <Tr key={order.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td>{order.name}</Td>
              <Td>{order.address}</Td>
              <Td>{order.city}</Td>
              <Td>{order.district}</Td>
              <Td>{order.phone}</Td>
              <Td>{order.paymentMethod}</Td>
              <Td>
                <Link to={`admin/orders/${order.id}`}>
                  <Button colorScheme="blue" size="sm">
                    Chi tiết
                  </Button>
                </Link>
              </Td>
              <Td>
                <Button colorScheme="red" size="sm" onClick={() => handleDeleteOrder(order.id)}>
                  Xóa
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default OrdersTable;
