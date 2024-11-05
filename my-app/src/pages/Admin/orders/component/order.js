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
  useToast, // Import useToast from Chakra UI
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
        setOrders((prevOrders) => prevOrders.filter(order => order.id !== selectedOrderId));
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
            <Th>Phương thức thanh toán</Th>
            <Th>Chi tiết</Th>
            <Th>Xóa</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order, index) => (
            <Tr key={order.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td>{order.users}</Td>
              <Td>{order.total_amount}</Td>
              <Td>{order.status}</Td>
              <Td>{order.shipping_address}</Td>
              <Td>{order.payment_method}</Td>
              <Td>
                <Link to={`/admin/orders/${order.id}`}>
                  <Button colorScheme="blue" size="sm">Chi tiết</Button>
                </Link>
              </Td>
              <Td>
                <Button colorScheme="red" size="sm" onClick={() => handleOpenDialog(order.id)}>
                  Xóa
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isDialogOpen} leastDestructiveRef={cancelRef} onClose={handleCloseDialog}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Xác nhận xóa</AlertDialogHeader>
            <AlertDialogBody>Bạn có chắc chắn muốn xóa đơn hàng này không?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCloseDialog}>Hủy</Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>Xóa</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default OrdersTable;
