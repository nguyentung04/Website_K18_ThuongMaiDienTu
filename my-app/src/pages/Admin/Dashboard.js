import React, { useEffect, useState } from 'react';
import { Flex, Text, Spinner, Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import Sidebar from '../../components/Admin/Sidebar';
import Navbar from '../../components/Admin/Navbar';
import { fetchUsers } from '../../service/api/users';
import { fetchDistricts } from '../../service/api/city';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userCounts, setUserCounts] = useState({});
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        countUsersForLastFourMonths(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    const getLocations = async () => {
      try {
        const data = await fetchDistricts();
        console.log("District Data:", data);
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoadingLocations(false);
      }
    };

    getUsers();
    getLocations();
  }, []);

  const countUsersForLastFourMonths = (users) => {
    const currentMonth = new Date().getMonth(); 
    const currentYear = new Date().getFullYear(); 

    const counts = {};

    for (let i = 0; i < 4; i++) {
      const monthIndex = currentMonth - i < 0 ? 12 + (currentMonth - i) : currentMonth - i;
      const monthKey = `${monthIndex + 1}/${currentYear}`;
      counts[monthKey] = 0;
    }

    users.forEach(user => {
      const userDate = new Date(user.createdAt); 
      const userMonth = userDate.getMonth(); 
      const userYear = userDate.getFullYear(); 

      for (let i = 0; i < 4; i++) {
        const monthIndex = currentMonth - i < 0 ? 12 + (currentMonth - i) : currentMonth - i;
        const monthKey = `${monthIndex + 1}/${currentYear}`;

        if (userMonth === monthIndex && userYear === currentYear) {
          counts[monthKey]++;
        }
      }
    });

    setUserCounts(counts);
  };

  const getColorForCounts = (counts) => {
    const values = Object.values(counts);
    const maxCount = Math.max(...values);
    const minCount = Math.min(...values);
    const avgCount = values.reduce((sum, value) => sum + value, 0) / values.length;

    return values.map(count => {
      if (count === maxCount) {
        return 'rgba(75, 192, 192, 1)';
      } else if (count === minCount) {
        return 'rgba(255, 99, 132, 1)';
      } else {
        return 'rgba(54, 162, 235, 1)';
      }
    });
  };

  const chartData = {
    labels: Object.keys(userCounts),
    datasets: [
      {
        label: 'Số người dùng đã đăng ký',
        data: Object.values(userCounts),
        backgroundColor: getColorForCounts(userCounts),
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    barPercentage: 0.5,
    categoryPercentage: 0.5,
  };

  return (
    <Flex direction="column" height="100vh" bg="#f7fafc" fontFamily="math">
      <Flex>
        <Sidebar />
        <Flex ml={{ base: 0, md: "250px" }} direction="column" flex="1" p={4} bg="#f7fafc">
          <Navbar />
          <Flex direction="column" p={4} mt="60px" gap={8}>
            <Flex direction="column" flex="1" mb={8}>
              <Text fontSize="2xl" fontWeight="bold">Thống kê người dùng</Text>
              {loadingUsers ? (
                <Spinner />
              ) : (
                <>
                  <Text fontSize="xl">Số người dùng đã đăng ký trong 4 tháng gần nhất:</Text>
                  <Box width="100%" height="300px" mt={4}>
                    <Bar data={chartData} options={chartOptions} />
                  </Box>
                </>
              )}
            </Flex>

            <Flex direction="column" flex="1">
              <Text fontSize="2xl" fontWeight="bold">Tỉnh Thành và Quận Huyện</Text>
              {loadingLocations ? (
                <Spinner />
              ) : (
                <Table variant="simple" mt={4} overflowX="auto">
                  <Thead>
                    <Tr>
                      <Th>Tỉnh/Thành phố</Th>
                      <Th>Quận/Huyện</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {locations.map((location, index) => (
                      <Tr key={index}>
                        <Td>{location.name}</Td>
                        <Td>{location.districts.join(', ')}</Td> 
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
