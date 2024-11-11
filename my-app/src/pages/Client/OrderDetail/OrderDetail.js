import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import "./OrderDetail.css";
import { AddressIcon, CardIcon } from "../../../components/icon/icon";

const BASE_URL = "http://localhost:3000";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order_items, setOrder] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // AlertDialog state
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/orderByName1/${id}`, {
          timeout: 10000,
        });
        console.log("API Response:", response);
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Có lỗi xảy ra khi lấy dữ liệu đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Mở hộp thoại xác nhận
  const handleCancelProduct = (productId) => {
    setProductToDelete(productId);
    setIsOpen(true);
  };

  // Đóng hộp thoại xác nhận
  const onClose = () => {
    setIsOpen(false);
    setProductToDelete(null);
  };

  // Xử lý khi người dùng xác nhận hủy sản phẩm
  const handleConfirmDelete = async () => {
    const username = localStorage.getItem("username");

    if (username && productToDelete) {
      try {
        const response = await axios.delete(
          `${BASE_URL}/api/order_items/${productToDelete}`,  // use productToDelete ID
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: { username },
          }
        );

        if (response.status === 200) {
          alert("Hủy sản phẩm thành công!");
          setOrder((prevOrder) =>
            prevOrder.filter((item) => item.id !== productToDelete)
          );
        } else {
          setError("Có lỗi xảy ra khi hủy sản phẩm.");
        }
      } catch (err) {
        console.error("Lỗi khi hủy sản phẩm:", err);
        setError("Có lỗi xảy ra khi hủy sản phẩm.");
      } finally {
        onClose();
      }
    } else {
      setError("Thiếu thông tin tên người dùng.");
      onClose();
    }
  };

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!order_items.length) {
    return <p>Không có đơn hàng nào.</p>;
  }

  return (
    <div className="order-detail-container">
      <h3>Chi tiết đơn hàng #{order_items[0].order_id}</h3>
      <div className="order-info">
        <div className="info-section">
          <span className="mb-4">
            <AddressIcon />
            THÔNG TIN NHẬN HÀNG
          </span>
          <div>
            <div className="info-section-address">Địa chỉ nhận:</div>
            <div className="info-section-address-content">
              {order_items[0].shipping_address}
            </div>
          </div>
          <div>
            <div className="info-section-time">Thời gian nhận:</div>
            {new Date(order_items[0].date).toLocaleString()}
          </div>
        </div>
        <div className="info-section-paymentMethod">
          <span className="mb-4">
            <CardIcon /> HÌNH THỨC THANH TOÁN
          </span>
          <p>
            {order_items[0].paymentMethod === "bank"
              ? "Chuyển khoản"
              : "Thanh toán khi nhận hàng"}
          </p>
        </div>
      </div>
      <div className="product-info">
        <h3>THÔNG TIN SẢN PHẨM</h3>
        {order_items.map((item) => (
          <div key={item.id} className="product-card">
            <img
              src={`${BASE_URL}/uploads/products/${item.image}`}
              alt={item.name}
            />
            <div className="product-details d-flex justify-content-between align-self-center">
              <h4>{item.product_name}</h4>
              <p>
                <strong>Giá:</strong>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.price)}
              </p>
              <p>
                <strong>Số lượng:</strong> {item.quantity}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(item.total_amount || 0)}
              </p>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-danger action-button cancel-button p-2"
                  onClick={() => handleCancelProduct(item.id)} // pass the item id
                >
                  Hủy sản phẩm
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="order-summary">
        <p>
          <strong>Tổng tiền:</strong>{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(
            order_items.reduce((total, item) => total + item.price * item.quantity, 0)
          )}
        </p>
        <Button colorScheme="red" onClick={() => navigate("/orderhistory")}>
          Quay lại
        </Button>
      </div>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận hủy sản phẩm này không
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn hủy sản phẩm này không?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} colorScheme="blue">
                Không
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Hủy sản phẩm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default OrderDetail;
