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
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { fetchOrders  } from "../../../../service/api/orders"; // Import your service functions

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");


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

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>stt</Th>
            <Th display="none">ID</Th>
            <Th>Tên người nhận</Th>
            <Th>Địa chỉ</Th>
            <Th>Số điện thoại</Th>
            <Th>Phương thức thanh toán</Th>
            <Th>Thời gian</Th>
            <Th>Chi tiết</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order, index) => (
            <Tr key={order.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td display="none">{order.id}</Td>
              <Td>{order.name}</Td>
              <Td>{order.address}</Td>
              <Td>{order.phone}</Td>
              <Td>{order.paymentMethod}</Td>
              <Td>{order.date}</Td>
              <Td>
                <Link to={`admin/orders/${order.id}`}>
                  <Button colorScheme="blue" size="sm">
                    Chi tiết
                  </Button>
                </Link>
              </Td>
             
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default OrdersTable;
