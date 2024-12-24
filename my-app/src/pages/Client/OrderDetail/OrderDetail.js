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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Toast,
} from "@chakra-ui/react";
import "./OrderDetail.css";
import { AddressIcon, CardIcon } from "../../../components/icon/icon";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:3000";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order_items, setOrder] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // AlertDialog and Modal state
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef();
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState(""); // State lưu lý do hủy

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Người dùng chưa đăng nhập hoặc token không tồn tại.");
          setLoading(false);
          return;
        }
        const decodedToken = jwtDecode(token);
        const userid = decodedToken.id;

        const response = await axios.get(
          `${BASE_URL}/api/order_items/${userid}/${id}`,
          {
            timeout: 10000,
          }
        );
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
  const handleCancelledOrder = async () => {
    if (productToDelete) {
      try {
        const response = await axios.put(
          `${BASE_URL}/api/order_items/${productToDelete}`, // URL API kèm theo ID của sản phẩm
          { status: "đã hủy" }, // Chỉ gửi trạng thái
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Header chứa token để xác thực
            },
          }
        );
  
        if (response.status === 200) {
          setOrder((prevOrder) =>
            prevOrder.map((item) =>
              item.id === productToDelete ? { ...item, status: "đã hủy" } : item
            )
          );
          setIsSuccessModalOpen(true); // Mở modal thông báo thành công
          window.location.reload(); // Tải lại trang sau khi cập nhật thành công
        } else {
          setError("Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.");
        }
      } catch (err) {
        console.error("Lỗi khi cập nhật trạng thái sản phẩm:", err);
        setError("Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.");
      } finally {
        onClose(); // Đóng hộp thoại xác nhận
      }
    } else {
      setError("Thiếu thông tin sản phẩm.");
      onClose();
    }
  };  
  
  //để cập nhật trạng thái đơn hàng thành completed.
  const handleMarkAsReceived = async (order_id) => {
    try {
      // Gửi yêu cầu cập nhật trạng thái của sản phẩm thành "completed"
      const response = await axios.put(
        `${BASE_URL}/api/orders/${order_id}/status`, // URL API kèm theo ID của sản phẩm
        { status: "đã nhận" }, // Dữ liệu cần cập nhật, trong trường hợp này là trạng thái "completed"
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Header chứa token để xác thực
          },
        }
      );

      // Kiểm tra nếu yêu cầu thành công (HTTP status 200)
      if (response.status === 200) {
        // Cập nhật trạng thái sản phẩm trong danh sách `order_items` (state)
        setOrder((prevOrder) =>
          prevOrder.map(
            (item) =>
              item.id === order_id ? { ...item, status: "đã nhận" } : item // Nếu ID trùng, thay đổi trạng thái thành "completed"
          )
        );
      }
      window.location.reload(); // Tải lại trang
    } catch (error) {
      // Xử lý khi có lỗi xảy ra trong quá trình gọi API
      console.error("Lỗi khi cập nhật trạng thái:", error); // Ghi lỗi vào console để debug
      setError("Có lỗi xảy ra khi xác nhận nhận hàng."); // Cập nhật lỗi vào state để hiển thị cho người dùng
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
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
            <div className="info-section-time">Thời gian đặt:</div>
            {new Date(order_items[0].created_at).toLocaleString()}
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
          <>
            <div key={item.id} className="product-card">
              <div className=" d-flex justify-content-around align-items-center">
                <img
                  src={`${BASE_URL}/uploads/products/${item.images}`}
                  alt={item.name}
                />
                <h4>{item.name}</h4>
                <p>
                  <strong>Giá:</strong>{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.product_price)}
                </p>
                <p>
                  <strong>Số lượng:</strong> {item.total_quantity}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.product_price * item.total_quantity || 0)}
                </p>
              </div>
            </div>{" "}
            <div className="d-flex justify-content-end">
              {item.status === "chờ xử lý" && (
                <button
                  type="button"
                  className="btn btn-danger action-button cancel-button p-2"
                  onClick={() => handleCancelProduct(item.order_id)}
                >
                  Hủy sản phẩm
                </button>
              )}
              {item.status === "đang giao" && (
                <button
                  type="button"
                  className="btn btn-success action-button received-button p-2"
                  onClick={() => handleMarkAsReceived(item.order_id)}
                >
                  Đã nhận hàng
                </button>
              )}
              {item.status === "đã hủy" && (
                <p className="text-danger">Sản phẩm đã bị hủy</p>
              )} {item.status === "đã nhận" && (
                <p className="text-success">Sản phẩm đã nhận</p>
              )}
            </div>
          </>
        ))}
      </div>
      <div className="order-summary">
        <p>
          <strong>Tổng tiền:</strong>{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(
            order_items.reduce(
              (total, item) => total + item.product_price * item.total_quantity,
              0
            )
          )}
        </p>
        <Button colorScheme="red" onClick={() => navigate("/orderhistory")}>
          Quay lại
        </Button>
      </div>
      {/* // Cập nhật giao diện AlertDialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xác nhận hủy sản phẩm
            </AlertDialogHeader>

            <AlertDialogBody>
              <p>Bạn có chắc chắn muốn hủy sản phẩm này không?</p>
              <textarea
                placeholder="Nhập lý do hủy..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} colorScheme="blue">
                Không
              </Button>
              <Button
                colorScheme="red"
                onClick={handleCancelledOrder} // Gọi hàm xử lý hủy sản phẩm
                ml={3}
              >
                Hủy sản phẩm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      ;{/* Success Modal */}
      <Modal isOpen={isSuccessModalOpen} onClose={closeSuccessModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thông báo</ModalHeader>
          <ModalBody>Hủy sản phẩm thành công!</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeSuccessModal}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OrderDetail;
