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
  // const [searchQuery, setSearchQuery] = useState(""); // Lưu chuỗi tìm kiếm
  // const [suggestions, setSuggestions] = useState([]); // Lưu gợi ý quận/huyện

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await fetchComment_detailById(id);
        setCommentDetails(data); // Dữ liệu là object
      } catch (error) {
        setError("Failed to fetch comment details");
        console.error("Error fetching comment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);
  
  const handleDelete = async () => {
    if (deletingId) {
      try {
        await deleteComment_detail(deletingId);
        setCommentDetails(null); // Xóa dữ liệu
        toast({
          title: "Bình luận đã xóa.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        onClose();
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
          Không có chi tiết bình luận.
        </Text>
      </Box>
    );
  }

  //** ========================================================================================== */
  
  // // Hàm xử lý sự kiện khi người dùng nhập vào ô tìm kiếm
  // const handleInputChange = (e) => {
  //   const query = e.target.value.toLowerCase();
  //   setSearchQuery(query);

  //   // Tìm kiếm dựa trên tên sản phẩm
  //   if (query !== "") {
  //     const filteredSuggestions = commentDetails.filter((review) =>
  //       review.detail_content?.toLowerCase().includes(query)
  //     );
  //     setSuggestions(filteredSuggestions);
  //   } else {
  //     setSuggestions([]);
  //   }
  // };
  // // Hàm xử lý khi người dùng chọn 1 gợi ý
  // const handleSuggestionClick = (suggestion) => {
  //   setSearchQuery(suggestion.detail_content); // Hiển thị tên sản phẩm đã chọn
  //   setSuggestions([]);
  // };

  // // Lọc danh sách đánh giá dựa trên tên sản phẩm
  // const filteredCommentDetails = commentDetails.filter((review) =>
  //   review.detail_content?.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  

  console.log(commentDetails);
  
  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Chi tiết bình luận #{id}
        </Text>
        {/*  ===================================== thanh tìm kiếm ================================*/}
        {/* <Flex align="center" mb={4}> */}
          {/* Input tìm kiếm */}
          {/* <Flex opacity={1}>
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleInputChange} // Sửa lại hàm onChange
              variant="outline"
              borderColor="#00aa9f"
              color="black"
              mr={2}
              width="200px"
            /> */}
            {/* Hiển thị gợi ý */}
            {/* {suggestions.length > 0 && (
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
                    {suggestion.content}
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
        </Flex> */}
      </Box>
      <Table variant="simple">
        <Thead bg={headerBgColor}>
          <Tr>
            <Th>ID comment</Th>
            <Th display={"none"}>ID </Th>
            <Th>Nội Dung</Th>
            <Th>Hành Động</Th>
          </Tr>
        </Thead>
      <Tbody>
          <Tr _hover={{ bg: hoverBgColor }}>
            <Td>{commentDetails.fullname}</Td>
            <Td>{commentDetails.detail_content}</Td>
            <Td>
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => openDeleteConfirm(commentDetails.id)}
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
