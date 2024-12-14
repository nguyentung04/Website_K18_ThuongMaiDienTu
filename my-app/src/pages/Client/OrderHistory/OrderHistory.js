import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Đảm bảo import đúng cách
import "./OrderHistory.css";
import { Divider } from "@chakra-ui/react";

const BASE_URL = "http://localhost:3000"; // Đảm bảo BASE_URL đúng với cấu hình API của bạn

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken = jwtDecode(token); // Giải mã token
          const user_id = decodedToken.id; // Kiểm tra trường user_id từ token

          const response = await axios.get(
            `${BASE_URL}/api/orderByName1/${user_id}`, // Đảm bảo endpoint chính xác
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.length > 0) {
            setOrders(response.data); // Nếu có đơn hàng, lưu dữ liệu
          } else {
            setOrders([]); // Nếu không có đơn hàng, set thành mảng rỗng
          }
        } catch (err) {
          console.error("Lỗi khi lấy đơn hàng:", err);
        } finally {
          setLoading(false); // Đặt trạng thái loading thành false khi dữ liệu đã được lấy
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div className="order-history">
      <h1>Lịch sử Đơn hàng</h1>
      <div className="orders-container">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div className="order-card" key={order.order_id}>
              <div className="order-header">
                <strong>Đơn hàng: #{order.order_id}</strong>
                <span className="order-status">
                 
                  <span>{order.status}</span>
                </span>
              </div>
              <Divider />
              <div className="order-body">
                <img
                  src={`${BASE_URL}/uploads/products/${order.images}`}
                  alt={order.name}
                  className="product-image"
                />

                <div className="order-info mb-3">
                  <span>{order.name}</span>
                  <span>Giá: {order.total_price}</span>
                  <span>số lượng: {order.total_quantity}</span>
                  <span>
                    Tổng tiền:{" "}
                    <span className="span-price">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </span>
                </div>
              </div>
              <div className="order-actions">
                <Link
                  to={`/orders/${order.order_id}`}
                  className="detail-button"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>Không có đơn hàng nào.</p> // Hiển thị khi không có đơn hàng
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
