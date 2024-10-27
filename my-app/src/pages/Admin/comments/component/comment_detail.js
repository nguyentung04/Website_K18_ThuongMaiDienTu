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
  Flex,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import {
  fetchComment_detailById,
  deleteComment_detail,
} from "../../../../service/api/comment_detail";
const CommentDetailTable = () => {
  const { id } = useParams();
  const [commentDetails, setCommentDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const headerBgColor = useColorModeValue("gray.200", "gray.800");
  //** ========================================================================================== */
  const [searchQuery, setSearchQuery] = useState(""); // Lưu chuỗi tìm kiếm
  const [suggestions, setSuggestions] = useState([]); // Lưu gợi ý quận/huyện

  useEffect(() => {
    if (id) {
      const fetchCommentDetails = async () => {
        try {
          const data = await fetchComment_detailById(id);
          setCommentDetails(data);
        } catch (error) {
          setError("Failed to fetch comment details");
          console.error("Error fetching comment details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCommentDetails();
    } else {
      setError("Invalid comment ID");
      setLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    if (deletingId) {
      try {
        await deleteComment_detail(deletingId);
        setCommentDetails((prevDetails) =>
          prevDetails.filter((item) => item.id !== deletingId)
        );
        toast({
          title: "Bình luận đã xóa.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        onClose(); // Close the modal after successful deletion
      } catch (error) {
        console.error("Error deleting comment:", error);
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

  //** ========================================================================================== */
  // Hàm xử lý sự kiện khi người dùng nhập vào ô tìm kiếm
  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Nếu chuỗi tìm kiếm không rỗng, lọc danh sách quận/huyện
    if (query !== "") {
      const filteredSuggestions = commentDetails.filter((commentDetails) =>
        commentDetails.content.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Hàm xử lý khi người dùng chọn 1 gợi ý
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.content); // Cập nhật chuỗi tìm kiếm với tên đã chọn
    setSuggestions([]); // Ẩn danh sách gợi ý sau khi chọn
  };

  // Filter commentDetails based on search query
  const filteredCommentDetails = commentDetails.filter((commentDetails) =>
    commentDetails.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Chi tiết bình luận của sản phẩm {id}
      </Text>
      <Table variant="simple">
        <Thead bg={headerBgColor}>
          <Tr>
            <Th>ID comment</Th>
            <Th>Họ tên khách hàng</Th>
            <Th>ID sản phẩm </Th>
            <Th>Nội Dung</Th>
            <Th>Hành Động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredCommentDetails.map((item) => (
            <Tr key={item.id} _hover={{ bg: hoverBgColor }}>
              <Td>{item.comment_id}</Td>
              <Td>{item.fullname}</Td>
              <Td>{item.id}</Td>
              <Td>{item.content}</Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => openDeleteConfirm(item.id)}
                >
                  Xóa
                </Button>
              </Td>
            </Tr>
          ))}
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
