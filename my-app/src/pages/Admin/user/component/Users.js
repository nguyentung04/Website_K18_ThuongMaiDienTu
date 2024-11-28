import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Button,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { fetchUsers, deleteUser } from "../../../../service/api/users";

const AuthorsTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Số lượng người dùng mỗi trang
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();

  useEffect(() => {
    const getUser = async () => {
      const fetchedData = await fetchUsers();
      if (fetchedData) {
        setData(fetchedData);
      }
    };
    getUser();
  }, []);

  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  const onClose = () => setIsOpen(false);

  const handleConfirmDelete = async () => {
    try {
      if (selectedUser) {
        await deleteUser(selectedUser.id);
        setData((prevData) =>
          prevData.filter((user) => user.id !== selectedUser.id)
        );
        toast({
          title: "Người dùng đã xóa.",
          description: "Người dùng đã bị xóa thành công.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi khi xóa người dùng",
        description: "Không xóa được người dùng.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Failed to delete user:", error);
    }
    setIsOpen(false);
  };

  const handleDeleteClick = (user) => {
    if (user.role === "admin") {
      toast({
        title: "Không thể xóa Admin",
        description: "Bạn không thể xóa người dùng có vai trò quản trị viên.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setSelectedUser(user);
      setIsOpen(true);
    }
  };

  const statusBadgeColor = (status) => {
    switch (status) {
      case "admin":
        return { bg: "red.500", color: "white" };
      case "users":
        return { bg: "gray.500", color: "white" };
      case "đang hoạt động":
        return { bg: "green.500", color: "white" };
      case "ngưng hoạt động":
        return { bg: "gray.500", color: "white" };
      default:
        return { bg: "gray.500", color: "white" };
    }
  };

  // Xác định dữ liệu trên trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
      <Flex mb={5} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold"></Text>
        <Link to="user/add">
          <Button
            bg="#1ba43b"
            color="white"
            _hover={{ bg: "#189537" }}
            _active={{ bg: "#157f31" }}
          >
            Thêm người dùng mới
          </Button>
        </Link>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Họ Tên</Th>
            <Th>Tài khoản</Th>
            <Th>Số điện thoại</Th>
            <Th>Phân quyền</Th>
            <Th>Trạng thái</Th>
            <Th>Hoạt động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentData.map((item, index) => (
            <Tr key={item.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{startIndex + index + 1}</Td>
              <Td>
                <Text fontWeight="bold">{item.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {item.email}
                </Text>
              </Td>
              <Td>
                <Text fontWeight="bold">{item.username}</Text>
              </Td>
              <Td>
                <Text fontWeight="bold">{item.phone}</Text>
              </Td>
              <Td>
                <Badge {...statusBadgeColor(item.role)}>
                  {item.role}
                </Badge>
              </Td>
              <Td>
                <Badge
                  bg={statusBadgeColor(item.status === 1 ? "đang hoạt động" : "ngưng hoạt động").bg}
                  color={statusBadgeColor(item.status === 1 ? "đang hoạt động" : "ngưng hoạt động").color}
                >
                  {item.status === 1 ? "đang hoạt động" : "ngưng hoạt động"}
                </Badge>
              </Td>
              <Td>
                <Link to={`user/edit/${item.id}`}>
                  <Button colorScheme="blue" size="sm" mr={2}>
                    Sửa
                  </Button>
                </Link>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteClick(item)}
                >
                  Xóa
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex justify="center" mt={4}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            mx={1}
            onClick={() => handlePageChange(i + 1)}
            bg={currentPage === i + 1 ? "blue.500" : "gray.200"}
            color={currentPage === i + 1 ? "white" : "black"}
            _hover={{ bg: "blue.400" }}
          >
            {i + 1}
          </Button>
        ))}
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận xóa
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa người dùng này không?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
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

export default AuthorsTable;
