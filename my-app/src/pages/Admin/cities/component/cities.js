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
import { fetchCities, deleteCities } from "../../../../service/api/cities";
import { Link } from "react-router-dom";

const CitiesPage = () => {
  const [cities, setCities] = useState([]); // Use consistent plural form
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null); // Correct misspelling
  const cancelRef = useRef();
  const toast = useToast();
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  //** ========================================================================================== */
  const [searchQuery, setSearchQuery] = useState(""); // Lưu chuỗi tìm kiếm
  const [suggestions, setSuggestions] = useState([]); // Lưu gợi ý quận/huyện

  useEffect(() => {
    const getCities = async () => {
      const data = await fetchCities(); // Fetch cities data
      if (data) {
        setCities(data);
      }
    };
    getCities();
  }, []);
  

  const handleConfirmDelete = async () => {
    try {
      if (selectedCity) {
        await deleteCities(selectedCity.id);  // Perform delete API call
        setCities((prevData) => prevData.filter((city) => city.id !== selectedCity.id));  // Update state
        toast({
          title: "Thành phố đã bị xóa.",
          description: "Thành phố đã được xóa thành công.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi khi xóa thành phố",
        description: "Không xóa được thành phố.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Không xóa được thành phố:", error);
    }
    setIsOpen(false);  // Close dialog
  };
  

  const onClose = () => setIsOpen(false);

  const handleDeleteClick = (city) => {
    setSelectedCity(city); // Set selected city for deletion
    setIsOpen(true);
  };
  
  //** ========================================================================================== */
  // Hàm xử lý sự kiện khi người dùng nhập vào ô tìm kiếm
  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Nếu chuỗi tìm kiếm không rỗng, lọc danh sách quận/huyện
    if (query !== "") {
      const filteredSuggestions = cities.filter((district) =>
        district.name.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Hàm xử lý khi người dùng chọn 1 gợi ý
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name); // Cập nhật chuỗi tìm kiếm với tên đã chọn
    setSuggestions([]); // Ẩn danh sách gợi ý sau khi chọn
  };

  // Filter cities based on search query
  const filteredcities = cities.filter((district) =>
    district.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md">
      <Flex mb={5} justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Danh sách tỉnh thành
        </Text>
        <Link to="admin/cities/add">
          <Button
            bg="#1ba43b"
            color="white"
            _hover={{ bg: "#189537" }}
            _active={{ bg: "#157f31" }}
          >
            Thêm quận/huyện
          </Button>
        </Link>
      </Flex>      {/*  ===================================== thanh tìm kiếm ================================*/}
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
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>STT</Th>
            <Th display={"none"}>ID</Th>
            <Th>Tỉnh thành</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredcities.map((city, index) => (
            <Tr key={city.id} _hover={{ bg: hoverBgColor }}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td display={"none"}>{city.id}</Td>
              <Td>{city.name}</Td>
              <Td>
                <Link to={`admin/cities/edit/${city.id}`}>
                  <Button colorScheme="blue" size="sm" mr={2}>
                    Sửa
                  </Button>
                </Link>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteClick(city)}
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

export default CitiesPage;
