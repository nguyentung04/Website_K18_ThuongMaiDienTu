import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Admin/Navbar";
import Sidebar from "../components/Admin/Sidebar";
import { Flex } from "@chakra-ui/react";

const AdminLayout = () => {
  const location = useLocation();


  return (
    <Flex direction="column" height="100vh" bg="#f7fafc" fontFamily="math">
      <Flex>
        <Sidebar />
        <Flex
          ml={{ base: 0, md: "300px" }}
          direction="column"
          flex="1" // Corrected this line
          p={4}
          bg="#f7fafc"
        >
          <Navbar/>
          <main>
            <Outlet /> {/* Outlet will display child routes */}
          </main>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AdminLayout;
