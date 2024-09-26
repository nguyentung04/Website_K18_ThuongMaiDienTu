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
  Avatar,
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
  Img, // Correctly import useToast
} from "@chakra-ui/react";

import { fetchUsers, deleteUser } from "../../../../service/api/users";

const AuthorsTable = () => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const cancelRef = useRef();
  const toast = useToast(); // Initialize toast

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
        await deleteUser(selectedUser.id); // Changed to deleteUser
        setData((prevData) =>
          prevData.filter((user) => user.id !== selectedUser.id)
        );
        toast({
          title: "User deleted.",
          description: "User has been deleted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting user",
        description: "Failed to delete the user.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Failed to delete user:", error);
    }
    setIsOpen(false); // Close the dialog
  };

  const handleDeleteClick = (user) => {
    if (user.role === "admin") {
      toast({
        title: "Cannot Delete Admin",
        description: "You cannot delete a user with the admin role.",
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
      default:
        return { bg: "gray.500", color: "white" };
    }
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
      <Flex mb={5} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold"></Text>
        <Link to="user/add">
          <Button
            bg="#1ba43b"
            color="white"
            _hover={{ bg: "#189537" }} // Màu khi hover
            _active={{ bg: "#157f31" }} // Màu khi click
          >
            Thêm người dùng mới
          </Button>
        </Link>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>stt</Th>
            <Th display="none">ID</Th>
            <Th>Họ Tên</Th>
            <Th>Tài khoản</Th>
            <Th>Số điện thoại</Th>
            <Th>Phân quyền</Th>
            <Th>Hoạt động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item,index) => (
            <Tr key={item.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td display="none">
                <Box display="flex" alignItems="center">
                  <Box>
                    <Text fontWeight="bold">{item.id}</Text>
                  </Box>
                </Box>
              </Td>
              <Td>
                <Box display="flex" alignItems="center">
                 
                  <Box>
                    <Text fontWeight="bold">{item.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {item.email}
                    </Text>
                  </Box>
                </Box>
              </Td>

              <Td>
                <Text fontWeight="bold">{item.username}</Text>
                <Text fontSize="sm" color="gray.500">
                </Text>
              </Td>
              <Td>
                <Box display="flex" alignItems="center">
                  <Box>
                    <Text fontWeight="bold">{item.phone}</Text>
                  </Box>
                </Box>
              </Td>
              <Td>
                <Badge
                  bg={statusBadgeColor(item.role).bg}
                  color={statusBadgeColor(item.role).color}
                >
                  {item.role}
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