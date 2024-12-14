import React, { useState } from "react";
import {
  Box,
  Stack,
  Text,
  Button,
  Avatar,
  useDisclosure,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import CategoryIcon, {
  HomeIcon,
  ProfileIcon,
  BagIcon,
  InvoiceIcon,
  CustomIcon,
  DistrictIcon,
  ProvinceIcon,
  ArticleIcon,
  FolderIcon,
} from "../../../components/icon/icon";

const Sidebar = () => {
  const user = {
    name: localStorage.getItem("username") || "John Doe",
    
    avatar: localStorage.getItem("avatar") || "https://bit.ly/broken-link",
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const sidebarBgColor = "#f7fafc";
  const linkColor = useColorModeValue("gray.500", "gray.400");
  const activeBg = useColorModeValue("white");
  const activeColor = useColorModeValue("#32dfd4", "white");
  const [isOrderOpen, setOrderOpen] = useState(false);
  const getLinkStyles = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? activeColor : linkColor,
    backgroundColor: isActive ? activeBg : "inherit",
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <>
      {!isMobile && (
        <Box
          width="300px"
          height="100vh"
          bg={sidebarBgColor}
          color="#5a5757"
          p={4}
          position="fixed"
          top="0"
          left="0"
          overflowY="auto"
          boxShadow="none"
        >
          <Stack spacing={4}>
            <Box textAlign="center">
              <Avatar size="xl" name={user.name} src={user.image} mb={4} />
              <Text fontSize="lg" fontWeight="bold" color={linkColor}>
                {user.name}
              </Text>
              
            </Box>
            <NavLink to="/admin/dashboard">
              {({ isActive }) => (
                <Button
                  fontFamily="math"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg={isActive ? activeBg : "inherit"}
                  color={isActive ? activeColor : linkColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  _hover={{ bg: activeBg, textDecoration: "none" }}
                  _active={{ bg: activeBg, color: activeColor }}
                  mb="0.5px"
                  mx="auto"
                  ps="16px"
                  py="12px"
                  borderRadius="15px"
                  w="100%"
                  height="50px"
                  leftIcon={
                    <HomeIcon
                      boxSize={5}
                      color={isActive ? activeColor : linkColor}
                    />
                  }
                >
                  Tổng kết
                </Button>
              )}
            </NavLink>
            <NavLink to="/admin/category">
              {({ isActive }) => (
                <Button
                  fontFamily="math"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg={isActive ? activeBg : "inherit"}
                  color={isActive ? activeColor : linkColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  _hover={{ bg: activeBg, textDecoration: "none" }}
                  _active={{ bg: activeBg, color: activeColor }}
                  mb="0.5px"
                  mx="auto"
                  ps="16px"
                  py="12px"
                  borderRadius="15px"
                  w="100%"
                  height="50px"
                  leftIcon={
                    <CategoryIcon
                      boxSize={5}
                      color={isActive ? activeColor : linkColor}
                    />
                  }
                >
                  Danh mục
                </Button>
              )}
            </NavLink>
            <NavLink to="/admin/products">
              {({ isActive }) => (
                <Button
                  fontFamily="math"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg={isActive ? activeBg : "inherit"}
                  color={isActive ? activeColor : linkColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  _hover={{ bg: activeBg, textDecoration: "none" }}
                  _active={{ bg: activeBg, color: activeColor }}
                  mb="0.5px"
                  mx="auto"
                  ps="16px"
                  py="12px"
                  borderRadius="15px"
                  w="100%"
                  height="50px"
                  leftIcon={
                    <BagIcon
                      boxSize={5}
                      color={isActive ? activeColor : linkColor}
                    />
                  }
                >
                  Sản phẩm
                </Button>
              )}
            </NavLink>{" "}
            
            <NavLink to="/admin/posts">
              {({ isActive }) => (
                <Button
                  fontFamily="math"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg={isActive ? activeBg : "inherit"}
                  color={isActive ? activeColor : linkColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  _hover={{ bg: activeBg, textDecoration: "none" }}
                  _active={{ bg: activeBg, color: activeColor }}
                  mb="0.5px"
                  mx="auto"
                  ps="16px"
                  py="12px"
                  borderRadius="15px"
                  w="100%"
                  height="50px"
                  leftIcon={
                    <ArticleIcon
                      boxSize={5}
                      color={isActive ? activeColor : linkColor}
                    />
                  }
                >
                  Bài viết
                </Button>
              )}
            </NavLink>{" "}
            <NavLink to="/admin/post_categories">
              {({ isActive }) => (
                <Button
                  fontFamily="math"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg={isActive ? activeBg : "inherit"}
                  color={isActive ? activeColor : linkColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  _hover={{ bg: activeBg, textDecoration: "none" }}
                  _active={{ bg: activeBg, color: activeColor }}
                  mb="0.5px"
                  mx="auto"
                  ps="16px"
                  py="12px"
                  borderRadius="15px"
                  w="100%"
                  height="50px"
                  leftIcon={
                    <FolderIcon
                      boxSize={5}
                      color={isActive ? activeColor : linkColor}
                    />
                  }
                >
                  Danh mục bài viết
                </Button>
              )}
            </NavLink>{" "}
            <NavLink
              to="/admin/comments"
              style={({ isActive }) => getLinkStyles({ isActive })}
            >
              {({ isActive }) => (
                <Button
                  fontFamily="math"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg={isActive ? activeBg : "inherit"}
                  color={isActive ? activeColor : linkColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  _hover={{ bg: activeBg, textDecoration: "none" }}
                  _active={{ bg: activeBg, color: activeColor }}
                  mb="0.5px"
                  mx="auto"
                  px="16px"
                  py="12px"
                  borderRadius="15px"
                  w="100%"
                  height="50px"
                  leftIcon={
                    <CustomIcon
                      boxSize={5}
                      color={isActive ? activeColor : linkColor}
                    />
                  }
                >
                  Bình luận
                </Button>
              )}
            </NavLink>
            <NavLink to="/admin/user">
              {({ isActive }) => (
                <Button
                  fontFamily="math"
                  justifyContent="flex-start"
                  alignItems="center"
                  bg={isActive ? activeBg : "inherit"}
                  color={isActive ? activeColor : linkColor}
                  fontWeight={isActive ? "bold" : "normal"}
                  _hover={{ bg: activeBg, textDecoration: "none" }}
                  _active={{ bg: activeBg, color: activeColor }}
                  mb="0.5px"
                  mx="auto"
                  ps="16px"
                  py="12px"
                  borderRadius="15px"
                  w="100%"
                  height="50px"
                  leftIcon={
                    <ProfileIcon
                      boxSize={5}
                      color={isActive ? activeColor : linkColor}
                    />
                  }
                >
                  Người dùng
                </Button>
              )}
            </NavLink>
             {/* Nút Đơn hàng */}
             <Button
              fontFamily="math"
              justifyContent="flex-start"
              alignItems="center"
              bg="inherit"
              color={linkColor}
              _hover={{ bg: activeBg, textDecoration: "none" }}
              _active={{ bg: activeBg, color: activeColor }}
              mb="0.5px"
              mx="auto"
              ps="16px"
              py="12px"
              borderRadius="15px"
              w="100%"
              height="50px"
              leftIcon={<InvoiceIcon boxSize={5} color={linkColor} />}
              onClick={() => setOrderOpen(!isOrderOpen)}
            >
              Đơn hàng
            </Button>
            {isOrderOpen && (
              <Stack spacing={2} pl={8}>
                <NavLink to="/admin/orders/paid">
                  {({ isActive }) => (
                    <Button
                      justifyContent="flex-start"
                      alignItems="center"
                      bg={isActive ? activeBg : "inherit"}
                      color={isActive ? activeColor : linkColor}
                      fontWeight={isActive ? "bold" : "normal"}
                      _hover={{ bg: activeBg, textDecoration: "none" }}
                      _active={{ bg: activeBg, color: activeColor }}
                      borderRadius="15px"
                      w="100%"
                      height="40px"
                      // fontSize="xl"
                    >
                      Đơn hàng đã thanh toán
                    </Button>
                  )}
                </NavLink>
                <NavLink to="/admin/orders/unpaid">
                  {({ isActive }) => (
                    <Button
                      justifyContent="flex-start"
                      alignItems="center"
                      bg={isActive ? activeBg : "inherit"}
                      color={isActive ? activeColor : linkColor}
                      fontWeight={isActive ? "bold" : "normal"}
                      _hover={{ bg: activeBg, textDecoration: "none" }}
                      _active={{ bg: activeBg, color: activeColor }}
                      borderRadius="15px"
                      w="100%"
                      height="40px"
                      // fontSize="xl"
                    >
                      Đơn hàng chưa thanh toán
                    </Button>
                  )}
                </NavLink>
              </Stack>
            )}
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Sidebar;