import React from 'react';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import Sidebar from '../../components/Admin/Sidebar';
import Navbar from '../../components/Admin/Navbar';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 300, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 200, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 278, pv: 3908, amt: 2000 },
  { name: 'May', uv: 189, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 239, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 349, pv: 4300, amt: 2100 },
];

const Dashboard = () => {
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
            <Text fontSize="2xl" fontWeight="bold">Tổng kết</Text>
            
            {/* Biểu đồ đường */}
            <Box mt={8} bg="white" p={4} borderRadius="md" boxShadow="md">
              <Text mb={4} fontSize="lg" fontWeight="semibold">Biểu đồ đường</Text>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* Biểu đồ cột */}
            <Box mt={8} bg="white" p={4} borderRadius="md" boxShadow="md">
              <Text mb={4} fontSize="lg" fontWeight="semibold">Biểu đồ cột</Text>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pv" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
