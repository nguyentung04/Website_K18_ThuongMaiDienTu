import React, { useEffect, useRef, useState } from "react";
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Input,
  List,
  ListItem,
} from "@chakra-ui/react";
import {
  fetchDistricts,
  deleteDistricts,
} from "../../../../service/api/districts";
import { Link } from "react-router-dom";

const DistrictsPage = () => {
  const [districts, setDistricts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null); // Updated variable name
  const cancelRef = useRef();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState(""); // Lưu chuỗi tìm kiếm
  const [suggestions, setSuggestions] = useState([]); // Lưu gợi ý quận/huyện

  const hoverBgColor = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const getDistricts = async () => {
      const data = await fetchDistricts(); // Fetch districts data
      if (data) {
        setDistricts(data);
      }
    };
    getDistricts();
  }, []);

  const handleConfirmDelete = async () => {
    try {
      if (selectedDistrict) {
        await deleteDistricts(selectedDistrict.id); // Perform delete API call
        setDistricts((prevData) =>
          prevData.filter((district) => district.id !== selectedDistrict.id)
        ); // Update state
        toast({
          title: "Huyện đã bị xóa.",
          description: "Huyện đã được xóa thành công.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi khi xóa huyện",
        description: "Không xóa được huyện.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Không xóa được huyện:", error);
    }
    setIsOpen(false); // Close dialog
  };

  const onClose = () => setIsOpen(false);

  const handleDeleteClick = (district) => {
    setSelectedDistrict(district); // Set selected district for deletion
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query !== "") {
      const filteredSuggestions = districts.filter((district) =>
        district.name.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name); // Update search query with selected district name
    setSuggestions([]); // Hide suggestions after selection
  };

  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Danh sách quận/huyện
        </Text>
        <Link to="admin/districts/add">
          <Button
            bg="#1ba43b"
            color="white"
            _hover={{ bg: "#189537" }}
            _active={{ bg: "#157f31" }}
          >
            Thêm quận/huyện
          </Button>
        </Link>
      </Flex>
      {/* Search Bar */}
      <Flex align="center" mb={4}>
        <Flex opacity={1}>
          <Input
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleInputChange} 
            variant="outline"
            borderColor="#00aa9f"
            color="black"
            mr={2}
            width="200px"
          />
          {suggestions.length > 0 && (
            <List
              border="1px solid #ccc"
              borderRadius="md"
              bg="white"
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
                  {suggestion.name}
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

      {/* District Table */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th display={"none"}>ID</Th>
            <Th>Quận/Huyện</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredDistricts.map((district, index) => (
            <Tr key={district.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td display={"none"}>{district.id}</Td>
              <Td>{district.name}</Td>
              <Td>
                <Link to={`admin/districts/edit/${district.id}`}>
                  <Button colorScheme="blue" size="sm" mr={2}>
                    Sửa
                  </Button>
                </Link>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteClick(district)}
                >
                  Xóa
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Confirmation Dialog */}
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
              Bạn có chắc chắn muốn xóa quận/huyện này không?
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

export default DistrictsPage;
