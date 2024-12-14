// const connection = require('../config/database');

// // Example function to get all categoris
// exports.getAllOrder_detail = (req, res) => {
//   connection.query('SELECT * FROM order_detail', (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json(results);
//   });
// };
// exports.orderByName = (req, res) => {
//   const { name } = req.params; // Lấy giá trị từ tham số URL

//   connection.query(
//     `SELECT 
//     o.*,        
//     od.*,       
//     p.*         
// FROM orders o
// JOIN order_detail od ON o.id = od.order_id
// JOIN products p ON od.product_id = p.id
// WHERE o.name = ?
// ;
// `, // Sử dụng dấu hỏi để bảo mật SQL Injection
//     [name], // Thay thế dấu hỏi bằng giá trị của name
//     (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       res.status(200).json(results);
//     }
//   );
// };



// exports.getOrderDetailById = (req, res) => {
//   const orderId = parseInt(req.params.id); // Lấy order_id từ tham số URL

//   // Thực hiện truy vấn SQL
//   connection.query(
//     `SELECT 
//        o.*,        
//        od.*        
//      FROM orders o
//      JOIN order_detail od ON o.id = od.order_id
//      WHERE o.id = ?`, // Sử dụng dấu hỏi để bảo mật SQL Injection
//     [orderId], // Thay thế dấu hỏi bằng giá trị của orderId
//     (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });  // Trả về lỗi với trạng thái 500 nếu có vấn đề
//       }
//       res.status(200).json(results);  // Trả về kết quả truy vấn dưới dạng JSON
//     }
//   );
// };

// const { validationResult } = require('express-validator'); // Optional: để xác thực yêu cầu

// // Update order status
// exports.updateOrderDetailStatus = (req, res) => {
//     const { id } = req.params; // ID đơn hàng từ URL
//     const { statuss } = req.body; // Trạng thái mới từ nội dung yêu cầu

//     // Xác thực đầu vào (tùy chọn)
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     // Truy vấn SQL để cập nhật trạng thái của đơn hàng
//     const query = `UPDATE order_detail SET statuss = ? WHERE order_id = ?`;

//     // Execute the query
//     connection.query(query, [statuss, id], (err, results) => {
//         if (err) {
//             console.error("Error updating order status:", err);
//             return res.status(500).json({ error: err.message });
//         }

//         if (results.affectedRows === 0) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         res.status(200).json({ message: "Order status updated successfully" });
//     });
// };

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


exports.orderByName = (req, res) => {
  const { name } = req.params; // Lấy giá trị từ tham số URL

  connection.query(
    `SELECT 
    o.*,        
    od.*,       
    p.*         
FROM orders o
JOIN order_detail od ON o.id = od.order_id
JOIN products p ON od.product_id = p.id
WHERE o.name = ?
;
`, // Sử dụng dấu hỏi để bảo mật SQL Injection
    [name], // Thay thế dấu hỏi bằng giá trị của name
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};



exports.getOrderDetailById = (req, res) => {
  const orderId = parseInt(req.params.id); // Lấy order_id từ tham số URL

  // Thực hiện truy vấn SQL
  connection.query(
    `SELECT o.*, od.* , u.name AS name,u.phone AS phone , p.name AS pr_name , pi.image_url AS images
FROM orders o JOIN order_items od ON o.id = od.order_id 
JOIN users u ON u.id = o.user_id 
JOIN products p ON p.id = od.product_id
JOIN product_images pi ON p.id = pi.product_id
WHERE o.id = ?`, // Sử dụng dấu hỏi để bảo mật SQL Injection
    [orderId], // Thay thế dấu hỏi bằng giá trị của orderId
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message }); // Trả về lỗi với trạng thái 500 nếu có vấn đề
      }
      res.status(200).json(results); // Trả về kết quả truy vấn dưới dạng JSON
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