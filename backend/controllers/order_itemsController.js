const connection = require('../config/database');

// Example function to get all categoris
exports.getAllorder_items = (req, res) => {
  connection.query('SELECT * FROM order_items', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};


exports.getAdminOrderDetailById = (req, res) => {
  const orderId = parseInt(req.params.id); // Lấy order_id từ tham số URL

  // Thực hiện truy vấn SQL
  connection.query(
    `SELECT o.*, od.* , u.name AS name ,u.phone AS userPhone, p.name AS pr_name 
    FROM orders o 
    JOIN order_items od ON o.id = od.order_id 
    JOIN users u ON u.id = o.user_id 
    JOIN products p ON p.id = od.product_id 
    WHERE o.id = ?`, // Sử dụng dấu hỏi để bảo mật SQL Injection
    [orderId], // Thay thế dấu hỏi bằng giá trị của orderId
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });  // Trả về lỗi với trạng thái 500 nếu có vấn đề
      }
      res.status(200).json(results);  // Trả về kết quả truy vấn dưới dạng JSON
    }
  );
};


// API lấy thông tin chi tiết đơn hàng
exports.getOrderClientDetailById = (req, res) => {
  const { userId, order_id } = req.params;  // Lấy userId và productId từ params

  // Đảm bảo bạn thực hiện truy vấn đúng ở đây
  connection.query(
    `SELECT o.*, od.*, p.*, u.name AS username,pi.image_url AS images
    FROM orders o
    JOIN order_items od ON o.id = od.order_id
    JOIN products p ON od.product_id = p.id
	JOIN product_images pi ON pi.product_id = p.id
    JOIN users u ON o.user_id = u.id
    WHERE o.user_id = ? AND od.order_id = ?`,
    [userId, order_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng cho sản phẩm này" });
      }
      res.status(200).json(results);
    }
  );
};


const { validationResult } = require('express-validator'); // Optional: để xác thực yêu cầu

// Update order status
exports.updateOrder_itemsDetailStatus = (req, res) => {
  const { id } = req.params; // ID đơn hàng từ URL
  const { status } = req.body; // Trạng thái mới từ nội dung yêu cầu
  console.log("Received status:", status);


  // Xác thực đầu vào (tùy chọn)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Truy vấn SQL để cập nhật trạng thái của đơn hàng
  const query = `UPDATE orders SET status = ? WHERE id = ?`;

  // Execute the query
  connection.query(query, [status, id], (err, results) => {
    if (err) {
      console.error("Error updating order status:", err);
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully" });
  });
};


exports.deleteOrder_items = (req, res) => {
  const postId = req.params.id; // Sử dụng cách đặt tên camelCase nhất quán

  // Chuẩn bị câu truy vấn SQL để xóa bài đăng
  const query = "DELETE FROM order_items WHERE id = ?";

  // Thực hiện câu truy vấn
  connection.query(query, [postId], (err, results) => {
    if (err) {
      // Ghi lại lỗi và phản hồi bằng mã trạng thái 500
      console.error("Lỗi truy vấn CSDL:", err);
      return res
        .status(500)
        .json({ error: "Có lỗi xảy ra khi xóa bài đăng." });
    }

    // Kiểm tra nếu không có hàng nào bị ảnh hưởng (tức là không có bài đăng nào bị xóa)
    if (results.affectedRows === 0) {
      // Nếu không có hàng nào bị ảnh hưởng, trả về mã trạng thái 404
      return res.status(404).json({ message: "Không tìm thấy bài đăng" });
    }

    // Phản hồi thành công khi bài đăng đã được xóa
    res.status(200).json({ message: "Bài đăng đã được xóa thành công" });
  });
};

exports.getOrderDetailByUserAndProduct = (req, res) => {
  const { userId, productId } = req.params; // Lấy userId và productId từ params

  // Thực hiện truy vấn để tìm order_id cho userId và productId
  connection.query(
    `SELECT o.id AS order_id, o.user_id, od.product_id
    FROM orders o
    JOIN order_items od ON o.id = od.order_id
    WHERE o.user_id = ? AND od.product_id = ?`,
    [userId, productId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng cho sản phẩm này của người dùng này." });
      }
      res.status(200).json(results[0]); // Trả về thông tin đơn hàng đầu tiên
    }
  );
};