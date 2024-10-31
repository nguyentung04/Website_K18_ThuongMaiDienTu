import React, { useEffect, useState } from 'react';
import { Flex, Text, Spinner, Box } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import Sidebar from '../../components/Admin/Sidebar';
import Navbar from '../../components/Admin/Navbar';
import { fetchUsers } from '../../service/api/users';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCounts, setUserCounts] = useState({});

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        countUsersForLastFourMonths(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
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
    barPercentage: 0.5, // Giảm chiều rộng cột
    categoryPercentage: 0.5, // Giảm khoảng cách giữa các cột
  };

  return (
    <Flex direction="column" height="100vh" bg="#f7fafc" fontFamily="math">
      <Flex>
        <Sidebar />
        <Flex ml={{ base: 0, md: "250px" }} direction="column" flex="1" p={4} bg="#f7fafc">
          <Navbar />
          <Flex direction="column" p={4} mt="60px">
            <Text fontSize="2xl" fontWeight="bold">Trang chính</Text>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Text fontSize="xl">Số người dùng đã đăng ký trong 4 tháng gần nhất:</Text>
                <Box width={{ base: "100%", md: "50%" }} height="300px" mt={4}>
                  <Bar data={chartData} options={chartOptions} />
                </Box>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
