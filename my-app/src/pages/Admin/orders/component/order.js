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
  Flex,
  Input,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { fetchOrders, deleteOrder } from "../../../../service/api/orders"; // Import service functions

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  //** ========================================================================================== */
  const [searchQuery, setSearchQuery] = useState(""); // Lưu chuỗi tìm kiếm
  const [suggestions, setSuggestions] = useState([]); // Lưu gợi ý quận/huyện
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
      const confirmDelete = window.confirm(
        "Bạn có chắc chắn muốn xóa đơn hàng này?"
      );
      if (confirmDelete) {
        await deleteOrder(id);
        setOrders(orders.filter((order) => order.id !== id)); // Cập nhật lại danh sách đơn hàng
      }
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
    }
  };
console.log(orders);

  //** ========================================================================================== */
  // Hàm xử lý sự kiện khi người dùng nhập vào ô tìm kiếm
  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Nếu chuỗi tìm kiếm không rỗng, lọc danh sách quận/huyện
    if (query !== "") {
      const filteredSuggestions = orders.filter((orders) =>
        orders.name.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Hàm xử lý khi người dùng chọn 1 gợi ý
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name); // Cập nhật chuỗi tìm kiếm với tên đã chọn
    setSuggestions([]); // Ẩn danh sách gợi ý sau khi chọn
  };

  // Filter orders based on search query
  const filteredorders = orders.filter((orders) =>
    orders.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold">
        Danh sách đơn hàng
      </Text>
      {/*  ===================================== thanh tìm kiếm ================================*/}
      <Flex align="center" mb={4}>
        {/* Input tìm kiếm */}
        <Flex opacity={1}>
          <Input
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleInputChange} // Sửa lại hàm onChange
            variant="outline"
            borderColor="#00aa9f"
            color="black"
            mr={2}
            width="200px"
          />
          {/* Hiển thị gợi ý */}
          {suggestions.length > 0 && (
            <List
              border="1px solid #ccc"
              borderRadius="md"
              bg="white"
              // mt={2}
              position={"absolute"}
              marginTop={10}
              width="200px"
              paddingLeft={0}
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
        <Button
          fontFamily="math"
          variant="solid"
          colorScheme="teal"
          bg="#00aa9f"
          _hover={{ bg: "#32dfd4" }}
          mr={4}
        >
          Tìm kiếm
        </Button>
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
            <Th>Chi tiết</Th>
            <Th>Xóa</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredorders.map((order, index) => (
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
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteOrder(order.id)}
                >
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
