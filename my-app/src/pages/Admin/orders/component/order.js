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
  Input,
  List,
  ListItem,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { fetchOrders, deleteOrder } from "../../../../service/api/orders"; // Import service functions

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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
        setOrders(orders.filter((order) => order.id !== id)); // Cập nhật lại danh sách đơn hàng
      }
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
    }
  };

  // Handle input change for search
  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter suggestions based on recipient's name
    if (query !== "") {
      const filteredSuggestions = orders.filter((order) =>
        order.name.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name); // Set search query to selected order name
    setSuggestions([]); // Clear suggestions after selection
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Danh sách đơn hàng
        </Text>
        <Flex align="center">
          {/* Search Input */}
          <Input
            placeholder="Tìm kiếm theo tên người nhận..."
            value={searchQuery}
            onChange={handleInputChange}
            variant="outline"
            borderColor="#00aa9f"
            mr={2}
            width="300px"
          />
          {suggestions.length > 0 && (
            <List
              border="1px solid #ccc"
              borderRadius="md"
              bg="white"
              position="absolute"
              marginTop={10}
              width="200px"
              paddingLeft={0}
              zIndex={10}
            >
              {suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.id}
                  p={2}
                  _hover={{ bg: "gray.200", cursor: "pointer" }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                </ListItem>
              ))}
            </List>
          )}
        </Flex>
      </Flex>
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
            <Th>Trạng thái</Th>
            <Th>Chi tiết</Th>
            <Th>Xóa</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredOrders.map((order, index) => (
            <Tr key={order.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td>{order.name}</Td>
              <Td>{order.address}</Td>
              <Td>{order.city}</Td>
              <Td>{order.district}</Td>
              <Td>{order.phone}</Td>
              <Td>{order.paymentMethod}</Td>
              <Td>{order.status}</Td>
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
