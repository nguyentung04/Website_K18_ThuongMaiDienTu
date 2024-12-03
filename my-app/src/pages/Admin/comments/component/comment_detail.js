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
  Spinner,
  Button,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import {
  fetchComment_detailById,
  deleteComment_detail,
} from "../../../../service/api/comment_detail";

const CommentDetailTable = () => {
  const { id } = useParams();
  const [commentDetails, setCommentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const headerBgColor = useColorModeValue("gray.200", "gray.800");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchComment_detailById(id);
        setCommentDetails(data);
      } catch (error) {
        setError("Không thể tải chi tiết bình luận");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (deletingId) {
      try {
        await deleteComment_detail(deletingId);
        setCommentDetails(null);
        toast({
          title: "Xóa thành công.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } catch (error) {
        toast({
          title: "Có lỗi xảy ra.",
          description: "Không thể xóa bình luận.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const openDeleteConfirm = (id) => {
    setDeletingId(id);
    onOpen();
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

  if (!commentDetails) {
    return (
      <Box p={5} bg="gray.100" borderRadius="lg">
        <Text fontSize="lg" color="gray.500">
          Không tìm thấy chi tiết bình luận.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Chi tiết bình luận #{id}
      </Text>
      <Table variant="simple">
        <Thead bg={headerBgColor}>
          <Tr>
            
            <Th>Nội dung</Th>
            <Th>Ngày tạo</Th>
            <Th>Tên người dùng</Th>

            <Th>Tên sản phẩm</Th>
            <Th>Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr _hover={{ bg: hoverBgColor }}>
            
            <Td>{commentDetails.detail_content}</Td>
            <Td>{new Date(commentDetails.detail_created_at).toLocaleString()}</Td>
            <Td>{commentDetails.fullname}</Td>
            
            <Td>{commentDetails.product_name}</Td>
            <Td>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => openDeleteConfirm(commentDetails.detail_id)}
              >
                Xóa
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      {/* Modal for Delete Confirmation */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xóa bình luận</ModalHeader>
          <ModalBody>
            <Text>Bạn có chắc chắn muốn xóa bình luận này không?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CommentDetailTable;
