import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import Sidebar from "../../components/Admin/Sidebar";
import { fetchUsers } from "../../service/api/users";
import { fetchOrders } from "../../service/api/orders";
import { Chart, registerables } from "chart.js";
import { Link } from "react-router-dom";
Chart.register(...registerables);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userCounts, setUserCounts] = useState({});
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [totalAmounts, setTotalAmounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, orderData] = await Promise.all([
          fetchUsers(),
          fetchOrders(),
        ]);

        setUsers(userData);
        countUsersForLastFourMonths(userData);

        setOrders(orderData);
        calculateTotalAmountByMonth(orderData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingUsers(false);
        setLoadingOrders(false);
      }
    };
    fetchData();
  }, []);

  const countUsersForLastFourMonths = (users) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const counts = {};

    for (let i = 0; i < 4; i++) {
      const monthIndex =
        currentMonth - i < 0 ? 12 + (currentMonth - i) : currentMonth - i;
      const monthKey = `${monthIndex + 1}/${currentYear}`;
      counts[monthKey] = 0;
    }

    users.forEach((user) => {
      const userDate = new Date(user.createdAt);
      const userMonth = userDate.getMonth();
      const userYear = userDate.getFullYear();

      for (let i = 0; i < 4; i++) {
        const monthIndex =
          currentMonth - i < 0 ? 12 + (currentMonth - i) : currentMonth - i;
        const monthKey = `${monthIndex + 1}/${currentYear}`;

        if (userMonth === monthIndex && userYear === currentYear) {
          counts[monthKey]++;
        }
      }
    });

    setUserCounts(counts);
  };

  const calculateTotalAmountByMonth = (orders) => {
    const currentDate = new Date();
    const amounts = {};
  
    // Chỉ giữ dữ liệu của 5 tháng gần nhất
    for (let i = 0; i < 5; i++) {
      const monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i
      );
      const monthKey = `${monthDate.getMonth() + 1}/${monthDate.getFullYear()}`;
      amounts[monthKey] = { total: 0, orders: 0 };
    }
  
    orders
      .filter((order) => order.status === "đã nhận") 
      .forEach((order) => {
        const orderDate = new Date(order.created_at);
        const monthKey = `${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
  
        if (amounts[monthKey]) {
          amounts[monthKey].total += parseInt(order.total_amount, 10);
          amounts[monthKey].orders += 1;
        }
      });
  
    setTotalAmounts(amounts);
  };
  
  const chartData = (counts, label, bgColor, borderColor) => ({
    labels: Object.keys(counts),
    datasets: [
      {
        label,
        data: Object.values(counts),
        backgroundColor: bgColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  const LoadingSpinner = () => (
    <Flex justify="center" align="center" height="100%">
      <Spinner />
    </Flex>
  );

  const ChartBox = ({ title, data, loading }) => (
    <Box flex="1" mb={6} p={4} bg="white" borderRadius="md" boxShadow="sm">
      <Text fontSize="lg" fontWeight="semibold" mb={4}>
        {title}
      </Text>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box width="100%" height="300px">
          <Bar data={data} options={chartOptions} />
        </Box>
      )}
    </Box>
  );

  return (
    <Flex direction="row" height="100vh" bg="#f7fafc">
      <Sidebar />
      <Flex direction="column" flex="1" p={6} bg="#f7fafc">
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Trang chủ
        </Text>
        <Text fontSize="lg" mt={4}>
          <Link to="/admin/revenue-detail" style={{ color: "blue", textDecoration: "underline" }}>
            Xem chi tiết doanh thu
          </Link>
        </Text>
        <Box width="100%" height="300px">
          <Bar
            data={{
              labels: Object.keys(totalAmounts),
              datasets: [
                {
                  label: "Tổng số tiền (VND)",
                  data: Object.values(totalAmounts).map((item) => item.total),
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 1,
                  yAxisID: 'y1',
                },
                {
                  label: "Số lượng đơn hàng",
                  data: Object.values(totalAmounts).map((item) => item.orders),
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                  yAxisID: 'y2',
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y1: {
                  beginAtZero: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: '',
                  },
                },
                y2: {
                  beginAtZero: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: '',
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: '',
                  },
                },
              },
            }}
          />
        </Box>
        <Flex direction={{ base: "column", lg: "row" }} gap={4}>
          <ChartBox
            title="Tổng người dùng trong tháng"
            data={chartData(
              userCounts,
              "Số người dùng đã đăng ký",
              "rgba(75, 192, 192, 0.2)",
              "rgba(75, 192, 192, 1)"
            )}
            loading={loadingUsers}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
