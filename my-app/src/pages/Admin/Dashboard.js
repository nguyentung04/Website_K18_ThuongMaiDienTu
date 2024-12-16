import React, { useEffect, useState } from "react";
import { Flex, Text, Spinner, Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import Sidebar from "../../components/Admin/Sidebar";
import { fetchUsers } from "../../service/api/users";
import { fetchProducts } from "../../service/api/products";
import { fetchOrders } from "../../service/api/orders";
import { Chart, registerables } from "chart.js";

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
        calculateTotalAmountByMonth(orderData); // Calculate total amount per month
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
      const monthIndex = currentMonth - i < 0 ? 12 + (currentMonth - i) : currentMonth - i;
      const monthKey = `${monthIndex + 1}/${currentYear}`;
      counts[monthKey] = 0;
    }

    users.forEach((user) => {
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

  const calculateTotalAmountByMonth = (orders) => {
    const amounts = {};

    // Tính tổng tiền cho mỗi tháng
    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      const monthKey = `${orderMonth + 1}/${orderYear}`;

      if (!amounts[monthKey]) {
        amounts[monthKey] = { total: 0, orders: 0 }; // Khởi tạo số lượng đơn hàng
      }
      amounts[monthKey].total += parseInt(order.total_amount, 10); // Chuyển đổi sang số nguyên
      amounts[monthKey].orders += 1; // Đếm số lượng đơn hàng
    });

    setTotalAmounts(amounts);
  };

  // Hàm định dạng số tiền theo các đơn vị: VND, nghìn VND, triệu VND, tỷ VND
  const formatAmount = (amount) => {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} tỷ VND`;
    } else if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')} triệu VND`;
    } else if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(0)} nghìn VND`;
    }
    return `${amount.toFixed(0)} VND`;
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
        <Box p={4} bg="white" borderRadius="md" boxShadow="sm" mt={6}>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Thống kê doanh thu theo tháng
          </Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Tháng</Th>
                <Th>Số lượng đơn hàng</Th>
                <Th>Tổng số tiền</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(totalAmounts).map((monthKey) => (
                <Tr key={monthKey}>
                  <Td>{monthKey}</Td>
                  <Td>{totalAmounts[monthKey].orders}</Td>
                  <Td>{formatAmount(totalAmounts[monthKey].total)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Flex direction={{ base: "column", lg: "row" }} gap={4}>
          <ChartBox
            title="Thống kê người dùng"
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
