import React from "react";
import { Flex } from "@chakra-ui/react";
import Sidebar from '../../../components/Admin/Sidebar';
import Navbar from '../../../components/Admin/Navbar';
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Flex direction="column" height="100vh" bg="#f7fafc" fontFamily="math">
      <Flex>
        <Sidebar />
        <Flex
          ml={{ base: 0, md: "250px" }}
          direction="column"
          flex="1"
          p={4}
          bg="#f7fafc"
        >
          <Navbar />
          <Flex direction="column" p={4} mt="60px">
            <Outlet /> {/* This will render the content based on the route */}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;
