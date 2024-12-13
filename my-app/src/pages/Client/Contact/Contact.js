import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Thông báo thành công
    toast({
      title: "Liên hệ thành công!",
      description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  return (
    <Box
      maxW="500px"
      mx="auto"
      mt="50px"
      p="20px"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
    >
      <Heading as="h2" size="lg" textAlign="center" mb="6">
        Liên Hệ
      </Heading>
      {isSubmitted ? (
        <Text fontSize="lg" color="green.500" textAlign="center">
          Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.
        </Text>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormControl id="name" mb="4" isRequired>
            <FormLabel>Họ và Tên</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên của bạn"
              focusBorderColor="blue.500"
            />
          </FormControl>
          <FormControl id="email" mb="4" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              focusBorderColor="blue.500"
            />
          </FormControl>
          <FormControl id="message" mb="4" isRequired>
            <FormLabel>Nội dung</FormLabel>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Nhập nội dung tin nhắn của bạn"
              focusBorderColor="blue.500"
              resize="none"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            mt="4"
            _hover={{ bg: "blue.600" }}
          >
            Gửi
          </Button>
        </form>
      )}
    </Box>
  );
};

export default Contact;
