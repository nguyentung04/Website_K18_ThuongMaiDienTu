import React, { useEffect, useState } from "react";
import { Flex, Text, Spinner, Box } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import Sidebar from "../../components/Admin/Sidebar";
import { fetchUsers } from "../../service/api/users";
import { fetchProducts } from "../../service/api/products";
import { fetchOrders } from "../../service/api/orders"; // Import the new fetchOrders function
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userCounts, setUserCounts] = useState({});
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productCounts, setProductCounts] = useState({});
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderCounts, setOrderCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, productData, orderData] = await Promise.all([
          fetchUsers(),
          fetchProducts(),
          fetchOrders(), // Fetch orders data
        ]);

        setUsers(userData);
        countUsersForLastFourMonths(userData);

        setProducts(productData);
        countProductsByCategory(productData);

        setOrders(orderData);
        countOrdersByMonth(orderData); // Count orders by month
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingUsers(false);
        setLoadingProducts(false);
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

  const countProductsByCategory = (products) => {
    const counts = {};
    products.forEach((product) => {
      const category = product.category || "Khác";
      counts[category] = (counts[category] || 0) + 1;
    });
    setProductCounts(counts);
  };

  // New function to count orders by month
  const countOrdersByMonth = (orders) => {
    const counts = {};
    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      const monthKey = `${orderMonth + 1}/${orderYear}`;

      counts[monthKey] = (counts[monthKey] || 0) + 1;
    });

    setOrderCounts(counts);
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
          <ChartBox
            title="Thống kê sản phẩm"
            data={chartData(
              productCounts,
              "Số lượng sản phẩm theo loại",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 1)"
            )}
            loading={loadingProducts}
          />
        </Flex>

        {/* Remove Posts statistics section */}
        <Flex direction={{ base: "column", lg: "row" }} gap={4} mt={6}>
          <ChartBox
            title="Thống kê đơn hàng"
            data={chartData(
              orderCounts,
              "Số lượng đơn hàng trong tháng",
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 99, 132, 1)"
            )}
            loading={loadingOrders}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
