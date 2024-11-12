import React, { useEffect, useState, useRef } from "react";
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Text,
  Flex,
  Input,
  List,
  ListItem, // Import useToast from Chakra UI
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { fetchOrders, deleteOrder } from "../../../../service/api/orders"; // Import service functions

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const cancelRef = useRef();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const toast = useToast(); // Initialize toast
  //** ========================================================================================== */
  const [searchQuery, setSearchQuery] = useState(""); // Lưu chuỗi tìm kiếm
  const [suggestions, setSuggestions] = useState([]); // Lưu gợi ý quận/huyện
  // Fetch orders
  useEffect(() => {
    const getOrders = async () => {
      try {
        const fetchedData = await fetchOrders();
        if (fetchedData) {
          setOrders(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    getOrders();
  }, []);

  // Open delete confirmation dialog
  const handleOpenDialog = (id) => {
    setSelectedOrderId(id);
    setIsDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrderId(null);
  };

  // Confirm delete and show toast notification
  const handleConfirmDelete = async () => {
    if (selectedOrderId) {
      try {
        await deleteOrder(selectedOrderId);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== selectedOrderId)
        );
        handleCloseDialog();
        toast({
          title: "Order deleted.",
          description: "The order was deleted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error deleting order.",
          description: "Failed to delete the order.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  //** ========================================================================================== */
  // Hàm xử lý sự kiện khi người dùng nhập vào ô tìm kiếm
  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Nếu truy vấn tìm kiếm không trống, hãy lọc danh sách đơn hàng
    if (query !== "") {
      const filteredSuggestions = orders.filter(
        (order) =>
          order.users &&
          typeof order.users === "string" &&
          order.users.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Hàm xử lý khi người dùng chọn 1 gợi ý
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.users); // Cập nhật chuỗi tìm kiếm với tên đã chọn
    setSuggestions([]); // Ẩn danh sách gợi ý sau khi chọn
  };

  // Lọc tên của người đặt hàng dựa trên truy vấn tìm kiếm
  const filtereOrders = orders.filter(
    (order) =>
      order.users &&
      typeof order.users === "string" &&
      order.users.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      {" "}
      <Box>
        <Text fontSize="2xl" fontWeight="bold">
          Danh sách đơn hàng
        </Text>

        {/*  ===================================== thanh tìm kiếm ================================*/}

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
                  {suggestion.title}
                </ListItem>
              ))}
            </List>
          )}
        </Flex>
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Tên người nhận</Th>
            <Th>Tổng</Th>
            <Th>Trạng thái</Th>
            <Th>Địa chỉ</Th>
            <Th>Phương thức thanh toán</Th>
            <Th>Chi tiết</Th>
            <Th>Xóa</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtereOrders.map((order, index) => (
            <Tr key={order.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td>{order.users}</Td>
              <Td>{order.total_amount}</Td>
              <Td>{order.status}</Td>
              <Td>{order.shipping_address}</Td>
              <Td>{order.payment_method}</Td>
              <Td>
                <Link to={`orders_detail/${order.id}`}>
                  <Button colorScheme="blue" size="sm">
                    Chi tiết
                  </Button>
                </Link>
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleOpenDialog(order.id)}
                >
                  Xóa
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCloseDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận xóa
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa đơn hàng này không?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseDialog}>
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default OrdersTable;
