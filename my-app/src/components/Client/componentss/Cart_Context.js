import React, { createContext, useState, useEffect } from "react";

// Tạo context cho giỏ hàng, cho phép các component khác truy cập trạng thái giỏ hàng
export const CartContext = createContext();

const CartProvider = ({ children }) => {
  // Khởi tạo trạng thái cho giỏ hàng với giá trị mặc định là mảng rỗng
  const [cart, setCart] = useState([]);

  // useEffect được sử dụng để lấy giỏ hàng từ localStorage khi component được mount (tải lên)
  useEffect(() => {
    // Lấy dữ liệu giỏ hàng từ localStorage, nếu không có thì sử dụng mảng rỗng
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart); // Cập nhật trạng thái giỏ hàng với dữ liệu đã lấy
  }, []); // Mảng phụ thuộc rỗng có nghĩa là effect này chỉ chạy một lần khi component được mount

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    // Cập nhật trạng thái giỏ hàng
    setCart((prevCart) => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingProduct = prevCart.find((item) => item.id === product.id);
  
      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng của sản phẩm
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity } // Cập nhật số lượng sản phẩm
            : item // Giữ nguyên sản phẩm khác
        );
      } else {
        // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới vào giỏ hàng
        return [...prevCart, { ...product, quantity: product.quantity }];
      }
    });
  };
  
  // Hàm tính số lượng sản phẩm duy nhất trong giỏ hàng
  const getTotalUniqueItems = () => {
    const uniqueItemIds = new Set(); // Sử dụng Set để lưu trữ các ID sản phẩm duy nhất

    // Duyệt qua từng sản phẩm trong giỏ hàng
    cart.forEach((item) => {
      uniqueItemIds.add(item.id); // Thêm ID sản phẩm vào Set
    });

    return uniqueItemIds.size; // Trả về số lượng sản phẩm duy nhất
  };

  // Cung cấp giá trị của context cho các component con
  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, getTotalUniqueItems }} // Giá trị được cung cấp cho context
    >
      {children} {/* Render tất cả các component con của CartProvider */}
    </CartContext.Provider>
  );
};

export default CartProvider; // Xuất component CartProvider để sử dụng ở nơi khác
