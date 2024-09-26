
// export default AddUser;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  useToast,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { addUser } from "../../../../service/api/users";

const AddUser = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); // New state for username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const toast = useToast();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Họ tên là bắt buộc.";
    if (!username) newErrors.username = "Tên đăng nhập là bắt buộc."; // Validation for username
    if (!email) newErrors.email = "Email là bắt buộc.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email không hợp lệ.";
    if (!password) newErrors.password = "Password là bắt buộc.";
    if (!phone) newErrors.phone = "Số điện thoại là bắt buộc.";
    else if (!/^\d{10}$/.test(phone)) newErrors.phone = "Số điện thoại không hợp lệ.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      try {
        // Prepare user data
        const userData = {
          name,
          username, // Include username in the data
          email,
          password,
          phone,
          role,
        };

        await addUser(userData); // API call to save the user

        toast({
          title: "Thành công!",
          description: "Người dùng đã được thêm thành công.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Redirect to the user list page
        navigate("/admin/user");
      } catch (error) {
        console.error("Error adding user:", error);
        toast({
          title: "Thêm người dùng thất bại.",
          description: error.response?.data?.message || error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleCancel = () => {
    navigate("/admin/user");
  };

  return (
    <Box p={5} bg="white" borderRadius="lg" boxShadow="md" fontFamily="math">
      <Heading mb={5}>Thêm thông tin</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4} isInvalid={errors.name}>
          <FormLabel>Họ tên</FormLabel>
          <Input
            type="text"
            placeholder="Nhập họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>
        <FormControl id="username" mb={4} isInvalid={errors.username}>
          <FormLabel>Tên đăng nhập</FormLabel> {/* New field for username */}
          <Input
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormErrorMessage>{errors.username}</FormErrorMessage>
        </FormControl>
        <FormControl id="email" mb={4} isInvalid={errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>
        <FormControl id="password" mb={4} isInvalid={errors.password}>
          <FormLabel>Mật khẩu</FormLabel>
          <Input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>
        <FormControl id="phone" mb={4} isInvalid={errors.phone}>
          <FormLabel>Số điện thoại</FormLabel>
          <Input
            type="text"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>
        <FormControl id="role" mb={4}>
          <FormLabel>Vai trò</FormLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </Select>
        </FormControl>
        <Button colorScheme="teal" type="submit" mr="10px">
          Thêm
        </Button>
        <Button colorScheme="gray" onClick={handleCancel}>
          Hủy
        </Button>
      </form>
    </Box>
  );
};

export default AddUser;