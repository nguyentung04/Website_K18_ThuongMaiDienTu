
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
} from "@chakra-ui/react";
import { fetchComments, updateCommentCounts } from "../../../../service/api/comments"; // Import the new API function
import { Link } from "react-router-dom";

const CommentPage = () => {
  const [comments, setComments] = useState([]);
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const getComments = async () => {
      try {
        const data = await fetchComments();
        if (data) {
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    getComments();
  }, []);

  const handleUpdateCounts = async () => {
    try {
      await updateCommentCounts(); // Call the API to update the comment counts
      const updatedComments = await fetchComments(); // Re-fetch comments to get updated counts
      setComments(updatedComments);
    } catch (error) {
      console.error("Error updating comment counts:", error);
    }
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Danh sách bình luận
        </Text>
        <Button colorScheme="green" onClick={handleUpdateCounts}>
          Cập nhật tổng số
        </Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th display="none">ID</Th>
            <Th>Họ tên</Th>
            <Th>Sản phẩm</Th>
            <Th>Tổng</Th>
            <Th>Thời gian</Th>
            <Th>Hành động</Th>
          </Tr>
        </Thead>
        <Tbody>
          {comments.map((comment, index) => (
            <Tr key={comment.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td display="none">{comment.id}</Td>
              <Td>{comment.fullname}</Td>
              <Td>{comment.name}</Td>
              <Td>{comment.count}</Td>
              <Td>{comment.created_at}</Td>
              <Td>
                <Link to={`admin/comments/${comment.id}`}>
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