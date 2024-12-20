import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Spinner,
  Button,
  useColorModeValue,
  useToast,
  Grid,
  GridItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import {
  fetchAdminOrderDetailById,
  updateOrderDetailStatus,
  deleteOrderDetail,
} from "../../../../service/api/order_items";

const OrderDetailTable = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await fetchAdminOrderDetailById(id);
        setOrderDetails(data);
      } catch (error) {
        setError("Failed to fetch order details");
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const handleApprove = async (itemId) => {
    try {
      console.log(`Updating status for order ID: ${itemId}`);
      await updateOrderDetailStatus(itemId, "đã nhận");

      // Cập nhật trạng thái trong state
      setOrderDetails((prevDetails) =>
        prevDetails.map((item) =>
          item.id === itemId ? { ...item, status: "đã nhận" } : item
        )
      );

      toast({
        title: "Đơn hàng đã được duyệt.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Tải lại trang sau khi duyệt thành công
      window.location.reload(); // Tải lại trang
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Có lỗi xảy ra.",
        description: "Không thể duyệt đơn hàng.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteConfirmation = (itemId) => {
    setItemToDelete(itemId);
    onOpen();
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteOrderDetail(itemToDelete);
      setOrderDetails((prevDetails) =>
        prevDetails.filter((item) => item.id !== itemToDelete)
      );
      toast({
        title: "Đơn hàng đã bị hủy.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Có lỗi xảy ra.",
        description: "Không thể hủy đơn hàng.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={5} bg="red.100" borderRadius="lg">
        <Text fontSize="lg" color="red.500">
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Box
        className="d-flex justify-content-between d-flex align-items-center"
        mb={4}
        fontWeight="bold"
      >
        <Text fontSize="2xl">Chi tiết đơn hàng #{id}</Text>

        <Button as={Link} to="/admin/orders/paid" colorScheme="blue">
          Quay lại
        </Button>
      </Box>
      {orderDetails.map((item) => (
        <Box
          key={item.id}
          mb={4}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          _hover={{ bg: hoverBgColor }}
        >
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem colSpan={1}>
              <Text>
                <strong>Tên khách hàng:</strong> {item.name}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Số điện thoại:</strong> {item.userPhone}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Địa chỉ:</strong> {item.shipping_address}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Phương thức thanh toán:</strong> {item.payment_method}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Thời gian:</strong> {item.created_at}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Giá:</strong> {formatCurrency(item.product_price)}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Số lượng:</strong> {item.total_quantity}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Tổng:</strong> {formatCurrency(item.total_amount)}
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Text>
                <strong>Trạng thái:</strong> {item.status}
              </Text>
            </GridItem>
            <GridItem colSpan={3} textAlign="right">
              {item.status === "chờ xử lý" && (
                <Button
                  colorScheme="green"
                  size="sm"
                  margin="10px"
                  onClick={() => handleApprove(item.order_id)}
                >
                  Duyệt
                </Button>
              )}
              {item.status !== "Đã hủy" && (
                <Button
                  display={"none"}
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteConfirmation(item.id)}
                >
                  Hủy đơn hàng
                </Button>
              )}
            </GridItem>
          </Grid>
        </Box>
      ))}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận hủy đơn hàng
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn hủy đơn hàng này không?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} colorScheme="blue">
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

export default OrderDetailTable;
