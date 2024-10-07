import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import Sidebar from '../../components/Admin/Sidebar';
import Navbar from '../../components/Admin/Navbar';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { fetchProducts } from '../../service/api/products'; // Đường dẫn tới file service sản phẩm

const Dashboard = () => {
  const [productData, setProductData] = useState([]);
  
  useEffect(() => {
    const getProductData = async () => {
      try {
        const data = await fetchProducts();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    
    getProductData();
  }, []);

  // Chuyển đổi dữ liệu productData thành định dạng cho biểu đồ
  const chartData = productData.map(product => ({
    name: product.name, // Giả sử có trường 'name' trong sản phẩm
    uv: product.sales || 0, // Cập nhật giá trị tương ứng với dữ liệu biểu đồ
    pv: product.stock || 0, // Cập nhật giá trị tương ứng với dữ liệu biểu đồ
    amt: product.price || 0, // Cập nhật giá trị tương ứng với dữ liệu biểu đồ
  }));

  return (
    <Flex direction="column" height="100vh" bg="#f7fafc" fontFamily="math">
      <Flex>
        <Sidebar />
        <Flex ml={{ base: 0, md: "250px" }} direction="column" flex="1" p={4} bg="#f7fafc">
          <Navbar />
          <Flex direction="column" p={4} mt="60px">
            <Text fontSize="2xl" fontWeight="bold">Tổng kết sản phẩm</Text>

            {/* Biểu đồ đường */}
            <Box mt={8} bg="white" p={4} borderRadius="md" boxShadow="md">
              <Text mb={4} fontSize="lg" fontWeight="semibold">Biểu đồ đường</Text>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
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
                <BarChart data={chartData}>
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
