import React from "react";
import { Flex } from "@chakra-ui/react";
import Sidebar from '../../../components/Admin/Sidebar';
import Navbar from '../../../components/Admin/Navbar';
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Flex direction="column" height="100vh" bg="#f7fafc" fontFamily="math">
      <Flex direction="column" p={4} mt="60px">
        <Outlet /> {/* This will render the content based on the route */}
      </Flex>
    </Flex>
  );
};

export default Layout;
