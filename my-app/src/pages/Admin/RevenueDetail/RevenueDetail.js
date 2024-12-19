import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchOrders } from "../../../service/api/orders";

const RevenueDetail = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số đơn hàng tối đa trên mỗi trang

  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderData = await fetchOrders();
        const currentYear = new Date().getFullYear();
  
        // Chỉ giữ lại các đơn hàng trong năm hiện tại và có trạng thái "đã nhận"
        const filteredOrders = orderData.filter(
          (order) =>
            new Date(order.created_at).getFullYear() === currentYear &&
            order.status === "đã nhận"
        );
  
        const totalRevenue = filteredOrders.reduce(
          (sum, order) => sum + parseInt(order.total_amount, 10),
          0
        );
  
        setOrders(filteredOrders);
        setYearlyRevenue(totalRevenue);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  

  // Tính toán các đơn hàng hiển thị trong trang hiện tại
  const currentOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <Flex direction="column" p={6} bg="#f7fafc" height="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Chi tiết doanh thu
        </Text>
        {/* <Button colorScheme="teal" onClick={() => navigate("/admin/dashboard")}>
          Quay lại Dashboard
        </Button> */}
      </Flex>
      
      {loading ? (
        <Flex justify="center" align="center" height="100%">
          <Spinner />
        </Flex>
      ) : (
        <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Tổng doanh thu năm nay: {yearlyRevenue.toLocaleString()} VND
          </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Mã đơn hàng</Th>
                <Th>Ngày tạo</Th>
                <Th>Tổng tiền (VND)</Th>
                <Th>Trạng thái</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentOrders.map((order) => (
                <Tr key={order.id}>
                  <Td>{order.orderCode}</Td>
                  <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
                  <Td>{parseInt(order.total_amount, 10).toLocaleString()}</Td>
                  <Td>{order.status}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {/* Điều hướng phân trang */}
          <Flex justify="space-between" mt={4}>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Trang trước
            </Button>
            <Text>
              Trang {currentPage} / {totalPages}
            </Text>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Trang sau
            </Button>
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

export default RevenueDetail;
