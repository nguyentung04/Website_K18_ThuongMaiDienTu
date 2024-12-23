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
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  IconButton,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { fetchOrders } from "../../../../service/api/orders"; // Import hàm fetchOrders

const UnpaidOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm đơn hàng
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
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false); // Dừng trạng thái tải
      }
    };
    getOrders();
  }, []);

  // Lọc danh sách đơn hàng dựa trên giá trị tìm kiếm
  const filteredOrders = orders.filter((order) =>
    order.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <InputGroup mb={4} width="300px" boxShadow="md" borderRadius="md">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Tìm kiếm đơn hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          borderRadius="md"
        />
        <InputRightElement>
          <IconButton
            size="sm"
            icon={<CloseIcon />}
            onClick={() => setSearchTerm("")}
            variant="ghost"
            aria-label="Clear search"
          />
        </InputRightElement>
      </InputGroup>
      {isLoading ? ( // Kiểm tra trạng thái tải
        <Text>Đang tải dữ liệu...</Text>
      ) : filteredOrders.length === 0 ? ( // Kiểm tra nếu không có dữ liệu
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Không có đơn hàng nào chưa thanh toán.
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
            {filteredOrders.map((order, index) => (
              <Tr key={order.id} _hover={{ bg: hoverBgColor }}>
                <Td fontWeight="bold">{index + 1}</Td>
                <Td>{order.userName}</Td>
                <Td>{order.shipping_address}</Td>
                <Td>{order.Districts}</Td>
                <Td>{order.Provinces}</Td>
                <Td>{order.orderStatus}</Td>
                <Td>{order.total_quantity}</Td>
                <Td>{order.payment_method}</Td>
                <Td>
                  <Button colorScheme="blue" size="sm">
                    Chi tiết
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default UnpaidOrders;
