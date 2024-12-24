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
  Text,
  Select,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { fetchOrders, updateOrderStatus } from "../../../../service/api/orders"; // Import các hàm service
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const [filter, setFilter] = useState("all"); // Trạng thái lọc đơn hàng
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái tìm kiếm đơn hàng
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false); // Trạng thái mở modal lý do hủy đơn
  const [cancelReason, setCancelReason] = useState(""); // Lý do hủy đơn
  const [selectedOrderId, setSelectedOrderId] = useState(null); // ID đơn hàng được chọn để hủy
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
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      } finally {
        setIsLoading(false); // Dừng trạng thái tải
      }
    };
    getOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    // Kiểm tra xem có thể cập nhật trạng thái đơn hàng không (không thể cập nhật trạng thái từ 'chờ xử lý' hoặc 'đang giao' sang 'đã nhận')
    const order = orders.find((order) => order.orderid === orderId);
    if (order && (order.status === "chờ xử lý" || order.status === "đang giao" || order.status === "đã hủy" || order.status === "đã xác nhận") && newStatus === "đã nhận") {
      toast.error("Không thể cập nhật trạng thái thành 'Đã nhận' từ 'Chờ xử lý' hoặc 'Đang giao'");
      return;
    }

    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderid === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      if (error.response && error.response.status === 404) {
        console.error(`Không tìm thấy đơn hàng với ID ${orderId}.`);
      }
    }
  };

  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsReasonModalOpen(true); // Mở modal lý do hủy đơn
  };

  const handleConfirmCancel = async () => {
    if (selectedOrderId) {
      await handleStatusChange(selectedOrderId, "đã hủy");
      setIsReasonModalOpen(false); // Đóng modal lý do hủy đơn
      setCancelReason(""); // Xóa lý do hủy đơn
      setSelectedOrderId(null); // Xóa ID đơn hàng được chọn
      toast.success("Hủy đơn hàng thành công!"); // Thông báo hủy đơn hàng thành công
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter !== "all" && order.status !== filter) return false;
    if (searchTerm && !order.userName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <ToastContainer />
      <Box mb={4} display="flex" justifyContent="space-between">
        <InputGroup width="300px" boxShadow="md" borderRadius="md">
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
        <Box>
          <Button onClick={() => setFilter("all")} colorScheme={filter === "all" ? "blue" : "gray"} mr={2}>
            Tất cả
          </Button>
          <Button onClick={() => setFilter("chờ xử lý")} colorScheme={filter === "chờ xử lý" ? "blue" : "gray"} mr={2}>
            Chờ xử lý
          </Button>
          <Button onClick={() => setFilter("đã xác nhận")} colorScheme={filter === "đã xác nhận" ? "blue" : "gray"} mr={2}>
            Đã xác nhận
          </Button>
          <Button onClick={() => setFilter("đang giao")} colorScheme={filter === "đang giao" ? "blue" : "gray"} mr={2}>
            Đang giao
          </Button>
          <Button onClick={() => setFilter("đã nhận")} colorScheme={filter === "đã nhận" ? "blue" : "gray"} mr={2}>
            Đã nhận
          </Button>
          <Button onClick={() => setFilter("đã hủy")} colorScheme={filter === "đã hủy" ? "blue" : "gray"}>
            Đã hủy
          </Button>
        </Box>
      </Box>
      {isLoading ? ( // Hiển thị thông báo tải dữ liệu
        <Text>Đang tải dữ liệu...</Text>
      ) : filteredOrders.length === 0 ? ( // Hiển thị thông báo nếu không có dữ liệu
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Không có đơn hàng nào.
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
              <Th>Nội dung hủy đơn</Th> {/* Thêm cột Nội dung hủy đơn */}
              <Th>Chi tiết</Th>
              <Th>Hủy đơn</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredOrders.map((order, index) => (
              <Tr key={order.orderid} _hover={{ bg: hoverBgColor }}>
                <Td fontWeight="bold">{index + 1}</Td>
                <Td>{order.userName}</Td>
                <Td>{order.shipping_address}</Td>
                <Td>{order.Districts}</Td>
                <Td>{order.Provinces}</Td>
                <Td>
                {order.status === "đã hủy" ? (
                    <Text>Đã hủy</Text>
                  ) : order.status === "đã nhận" ? (
                    <Text>Đã nhận</Text>
                  ) : (
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderid, e.target.value)}
                      isDisabled={order.status === "đã hủy"}
                    >
                      <option value="chờ xử lý">Chờ xử lý</option>
                      <option value="đã xác nhận">Đã xác nhận</option>
                      <option value="đang giao">Đang giao</option>
                      <option value="đã nhận">Đã nhận</option>
                    </Select>
                  )}
                </Td>
                <Td>{order.total_quantity}</Td>
                <Td>{order.payment_method}</Td>
                <Td>{order.payment_method}</Td>
                <Td>
                  <Link to={`/admin/orders/paid/order_items/${order.orderid}`}>
                    <Button colorScheme="blue" size="sm">
                      Chi tiết
                    </Button>
                  </Link>
                </Td>
                <Td>
                  {order.status !== "đã hủy" && (
                    <Button colorScheme="red" size="sm" onClick={() => handleCancelOrder(order.orderid)}>
                      Hủy
                    </Button>
                  )}
                </Td>
                <Td>{order.cancelReason}</Td> {/* Thêm nội dung hủy đơn */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Reason Modal */}
      <Modal isOpen={isReasonModalOpen} onClose={() => setIsReasonModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lý do hủy đơn</ModalHeader>
          <ModalBody>
            <Textarea
              placeholder="Nhập lý do hủy đơn"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              mt={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsReasonModalOpen(false)}>
              Hủy
            </Button>
            <Button colorScheme="red" onClick={handleConfirmCancel} ml={3} isDisabled={!cancelReason.trim()}>
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OrdersTable;
