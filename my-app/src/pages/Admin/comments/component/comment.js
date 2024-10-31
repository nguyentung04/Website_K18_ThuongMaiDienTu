// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   useColorModeValue,
//   Button,
//   Flex,
//   Text,
// } from "@chakra-ui/react";
// import { fetchComments, fetchCommentsById } from "../../../../service/api/comments"; // Đảm bảo fetchComments phù hợp với bình luận
// import { Link } from "react-router-dom";

// const CommentPage = () => {
//   const [comments, setComments] = useState([]);
//   const hoverBgColor = useColorModeValue("gray.100", "gray.700");

//   useEffect(() => {
//     const getComments = async () => {
//       try {
//         const data = await fetchComments();
//         if (data) {
//           setComments(data);
//         }
//       } catch (error) {
//         console.error("Error fetching comments:", error);
//       }
//     };
//     getComments();
//   }, []);

//   return (
//     <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
//       <Flex mb={5} justify="space-between" align="center">
//         <Text fontSize="2xl" fontWeight="bold">
//           Danh sách bình luận
//         </Text>
//       </Flex>
//       <Table variant="simple">
//         <Thead>
//           <Tr>
//             <Th>STT</Th>
//             <Th display="none">ID</Th>
//             <Th>Họ tên</Th>
//             <Th>Sản phẩm</Th>
//             <Th>Tổng</Th>
//             <Th>Thời gian</Th>
//             <Th>Hành động</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {comments.map((comment, index) => (
//             <Tr key={comment.id} _hover={{ bg: hoverBgColor }}>
//               <Td fontWeight="bold">{index + 1}</Td>
//               <Td display="none">{comment.id}</Td>
//               <Td>{comment.fullname}</Td>
//               <Td>{comment.name}</Td> {/* Đảm bảo thuộc tính phù hợp */}
//               <Td>{comment.count}</Td> {/* Đảm bảo thuộc tính phù hợp */}
//               <Td>{comment.created_at}</Td> {/* Đảm bảo thuộc tính phù hợp */}
//               <Td>
//               <Link to={`admin/comments/${comment.id}`}>
//                   <Button colorScheme="blue" size="sm" mr={2}>
//                     Chi tiết
//                   </Button>
//                 </Link>
//               </Td>
//             </Tr>
//           ))}
//         </Tbody>
//       </Table>
//     </Box>
//   );
// };

// export default CommentPage;

import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Button,
  Flex,
  Text,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import {
  fetchComments,
  updateCommentCounts,
} from "../../../../service/api/comments"; // Import the new API function
import { Link } from "react-router-dom";

const CommentPage = () => {
  const [comments, setComments] = useState([]);
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  const [searchQuery, setSearchQuery] = useState(""); // Lưu chuỗi tìm kiếm
  const [suggestions, setSuggestions] = useState([]); // Lưu gợi ý

  useEffect(() => {
    const getReviews = async () => {
      try {
        const data = await fetchProductReviews(); // Gọi API mới
        if (data) {
          setReviews(data);
        }
      } catch (error) {
        console.error("Error fetching product reviews:", error);
      }
    };
    getReviews();
  }, []);

  const handleUpdateCounts = async () => {
    try {
      await updateCommentCounts(); // Call the API to update the comment counts
      const updatedComments = await fetchComments(); // Re-fetch comments to get updated counts
      setComments(updatedComments);
    } catch (error) {
      console.error("Error updating product review counts:", error);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query !== "") {
      const filteredSuggestions = reviews.filter((review) =>
        review.fullname.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.fullname); // Cập nhật chuỗi tìm kiếm với tên đã chọn
    setSuggestions([]); // Ẩn danh sách gợi ý sau khi chọn
  };

  const filteredReviews = reviews.filter((review) =>
    review.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Danh sách bình luận
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
                      {suggestion.fullname}
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
        </Box>
        <Button colorScheme="green" onClick={handleUpdateCounts}>
          Cập nhật tổng số
        </Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th>Họ tên khách hàng</Th>
            <Th>ID khách hàng</Th>
            <Th>Sản phẩm</Th>
            <Th>ID sản phẩm</Th>
            {/* <Th>Tổng</Th> */}
            <Th>Thời gian</Th>
            <Th>Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredcomments.map((comment, index) => (
            <Tr key={comment.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>    
              <Td>{comment.fullname}</Td>
              <Td>{comment.user_id}</Td>
              <Td>{comment.name}</Td>
              <Td>{comment.id}</Td>
              {/* <Td>{comment.count}</Td> */}
              <Td>{comment.created_at}</Td>
              <Td>
                <Link to={`admin/reviews/${review.id}`}>
                  <Button colorScheme="blue" size="sm" mr={2}>
                    Chi tiết
                  </Button>
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CommentPage;
