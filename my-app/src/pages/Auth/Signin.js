import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
  HStack,
  Text,
  Link
} from '@chakra-ui/react';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/loginAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Đăng nhập không thành công');
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username); // Lưu tên đăng nhập vào localStorage
        localStorage.setItem('role', data.role); // Lưu vai trò vào localStorage
       
        toast({
          title: 'Đăng nhập thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Điều hướng dựa trên vai trò
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/'); // Hoặc một trang khác dành cho người dùng
        }
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Có lỗi xảy ra');
    }
  };

  return (
    <Box maxW="lg" mx="auto" mt="8" p="6" borderWidth="1px" borderRadius="lg">
      <Heading textAlign="center" mb="6">Đăng nhập</Heading>
      <VStack spacing="4" as="form" onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel htmlFor="username">Tên đăng nhập</FormLabel>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tên đăng nhập"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="password">Mật khẩu</FormLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
          />
        </FormControl>
        {error && <Text color="red.500">{error}</Text>}
        <Button
          type="submit"
          colorScheme="teal"
          size="lg"
          width="full"
        >
          Đăng nhập
        </Button>
        
      </VStack>
    </Box>
  );
};

export default SignIn;

