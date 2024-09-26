import React, { useState } from 'react';
import { Flex, Box, Text, Button, Input } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('avatar');
    localStorage.removeItem('email');

    // Redirect to login page
    navigate('/login');
  };

  const handleSearch = () => {
    // Xử lý tìm kiếm (ví dụ: chuyển hướng đến trang kết quả tìm kiếm)
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <Flex
      as="nav"
      p={4}
      bg="none"
      color="white"
      justify="space-between"
      align="center"
      height="100%"
    >
      <Box>
        <Text fontSize="xl" fontWeight="bold" color="black" fontFamily="math">
          Admin Panel
        </Text>
      </Box>

      <Flex align="center">
        {/* Input tìm kiếm */}
        <Input
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outline"
          borderColor="#00aa9f"
          color="black"
          mr={2}
          width="200px"
        />
        <Button
          onClick={handleSearch}
          fontFamily="math"
          variant="solid"
          colorScheme="teal"
          bg="#00aa9f"
          _hover={{ bg: "#32dfd4" }}
          mr={4}
        >
          Tìm kiếm
        </Button>
        
        {/* Nút Đăng xuất */}
        <Button
          onClick={handleLogout}
          fontFamily="math"
          variant="outline"
          colorScheme="teal"
          borderColor="#00aa9f"
          color="#00aa9f"
          _hover={{ borderColor: "#32dfd4", color: "#32dfd4", bg: "transparent" }}
        >
          Đăng xuất
        </Button>
      </Flex>
    </Flex>
  );
};

export default Navbar;
