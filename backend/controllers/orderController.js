const connection = require("../config/database");

//Minh Canh
// Lấy tất cả đơn hàng
exports.getAllOrders = (req, res) => {
  connection.query(
    `SELECT 
      o.*, 
      u.name AS users
    FROM orders o
    LEFT JOIN users u ON o.user_id  = u.id`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};

// Lấy toàn bộ đơn hàng theo name
exports.orderByName = (req, res) => {
  const { name } = req.params; // Lấy giá trị từ tham số URL

  connection.query(
    `SELECT 
      o.*,        
      od.*,       
      p.*         
    FROM orders o
    JOIN order_items od ON o.id = od.order_id
    JOIN products p ON od.product_id = p.id
    WHERE o.name = ?`, // Sử dụng dấu hỏi để bảo mật SQL Injection
    [name], // Thay thế dấu hỏi bằng giá trị của name
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};

// Lấy toàn bộ đơn hàng theo  id người dùng
exports.orderByName1 = (req, res) => {
  const { id } = req.params;

  // Kiểm tra xem id có hợp lệ không
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  connection.query(
    ` SELECT o.*, od.*, p.* ,pi.image_url AS images
 FROM orders o 
 JOIN order_items od ON o.id = od.order_id 
 JOIN products p ON od.product_id = p.id 
  JOIN product_images pi ON pi.product_id = p.id 
 WHERE o.user_id =   ?;`,
    [id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error: " + err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(results);
    }
  );
};

// Lấy toàn bộ đơn hàng theo trạng thái đã thanh toán
exports.orderByStatusPaid = (req, res) => {
  connection.query(
    `SELECT 
  o.id AS orderid,
  o.shipping_address,
  o.Provinces,
  o.Districts,
  o.status AS orderStatus,
  o.payment_method,
  o.total_amount,
  u.name AS userName,
  u.email,
  SUM(o_i.total_quantity) AS total_quantity
FROM orders o
JOIN order_items o_i ON o_i.order_id = o.id
JOIN users u ON o.user_id = u.id
WHERE o.payment_method = 'momo' AND o.status = 'chờ xử lý'
GROUP BY o.id, u.id, o.payment_method,  o.shipping_address,
  o.Provinces,
  o.Districts, o.total_amount, u.name, u.email
  ORDER BY o.created_at DESC; -- Sắp xếp từ mới đến cũ
`,

    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error: " + err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(results);
    }
  );
};

exports.orderByStatusOrderDelivered = (req, res) => {
  connection.query(
    `SELECT 
  o.id AS orderid,
  o.shipping_address,
  o.Provinces,
  o.Districts,
  o.status AS orderStatus,
  o.payment_method,
  o.total_amount,
  u.name AS userName,
  u.email,
  SUM(o_i.total_quantity) AS total_quantity
FROM orders o
JOIN order_items o_i ON o_i.order_id = o.id
JOIN users u ON o.user_id = u.id
WHERE  o.status = 'đã nhận '
GROUP BY o.id, u.id, o.payment_method,  o.shipping_address,
  o.Provinces,
  o.Districts, o.total_amount, u.name, u.email
  ORDER BY o.created_at DESC; -- Sắp xếp từ mới đến cũ`,

    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error: " + err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(results);
    }
  );
};
exports.orderByStatusOrderCancelled  = (req, res) => {
  connection.query(
    `SELECT 
  o.id AS orderid,
  o.shipping_address,
  o.Provinces,
  o.Districts,
  o.status AS orderStatus,
  o.payment_method,
  o.total_amount,
  u.name AS userName,
  u.email,
  SUM(o_i.total_quantity) AS total_quantity
FROM orders o
JOIN order_items o_i ON o_i.order_id = o.id
JOIN users u ON o.user_id = u.id
WHERE  o.status = 'đã hủy'
GROUP BY o.id, u.id, o.payment_method,  o.shipping_address,
  o.Provinces,
  o.Districts, o.total_amount, u.name, u.email
  ORDER BY o.created_at DESC; -- Sắp xếp từ mới đến cũ`,

    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error: " + err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(results);
    }
  );
};
// Lấy toàn bộ đơn hàng theo  trạng thái chưa thanh toán
exports.orderByStatusUnpaid = (req, res) => {
  connection.query(
    `SELECT 
  o.id AS orderid,
  o.shipping_address,
  o.Provinces,
  o.Districts,
  o.status AS orderStatus,
  o.payment_method,
  o.total_amount,
  u.name AS userName,
  u.email,
  SUM(o_i.total_quantity) AS total_quantity
FROM orders o
JOIN order_items o_i ON o_i.order_id = o.id
JOIN users u ON o.user_id = u.id
WHERE o.payment_method = 'COD' AND o.status = 'chờ xử lý'
GROUP BY o.id, u.id, o.payment_method,  o.shipping_address,
  o.Provinces,
  o.Districts, o.total_amount, u.name, u.email
  ORDER BY o.created_at DESC; -- Sắp xếp từ mới đến cũ`,

    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error: " + err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(results);
    }
  );
};
exports.orderDetail = (req, res) => {
  const { id } = req.params;

  // Kiểm tra xem id có hợp lệ không
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  connection.query(
    `SELECT 
      o.*,        
      od.*,       
      p.*         
    FROM orders o
    JOIN order_items od ON o.id = od.order_id
    JOIN products p ON od.product_id = p.id
    WHERE o.id = ?;`,
    [id],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error: " + err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(results);
    }
  );
};

// Lấy đơn hàng theo ID
// exports.getOrderById = (req, res) => {
//   const orderId = parseInt(req.params.id);

//   connection.query(
//     `SELECT
//       o.*,
//       c.name AS city,
//       d.name AS district
//     FROM orders o
//     LEFT JOIN cities c ON o.id_cities = c.id
//     LEFT JOIN districts d ON o.id_districts = d.id
//     WHERE o.id = ?`,
//     [orderId],
//     (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       if (results.length === 0) {
//         return res.status(404).json({ error: "Order not found" });
//       }
//       res.status(200).json(results);
//     }
//   );
// };

// Xóa đơn hàng theo order_id
exports.deleteOrder = (req, res) => {
  const { id } = req.params;

  // Bắt đầu transaction
  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Xóa chi tiết đơn hàng trước
    connection.query(
      "DELETE FROM order_items WHERE order_id = ?",
      [id],
      (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        // Xóa đơn hàng
        connection.query("DELETE FROM orders WHERE id = ?", [id], (err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }

          // Cam kết transaction
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }
            res.status(200).json({ message: "Order deleted successfully" });
          });
        });
      }
    );
  });
};

// Thêm đơn hàng (POST Orders)
exports.PostOrders = (req, res) => {
  const {
    total_amount,
    orderCode,
    shipping_address,
    Provinces,
    Districts,
    paymentMethod,
    orderItems,
    user_id, // Thêm user_id vào đây
  } = req.body;

  // Kiểm tra log để đảm bảo user_id được truyền vào
  console.log("User ID:", user_id);

  if (
    !orderCode ||
    !total_amount ||
    !shipping_address ||
    !paymentMethod ||
    !orderItems ||
    !user_id
  ) {
    console.error("Thiếu thông tin cần thiết:", {
      orderCode,
      total_amount,
      shipping_address,
      paymentMethod,
      orderItems,
      user_id,
    });
    return res.status(400).json({ error: "Thiếu thông tin cần thiết" });
  }

  // Bắt đầu giao dịch để đảm bảo toàn vẹn dữ liệu
  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi bắt đầu giao dịch" });
    }

    // Thêm đơn hàng vào bảng orders (không bao gồm user_id)
    const sql =
      "INSERT INTO orders (orderCode,user_id, shipping_address, Provinces, Districts, total_amount, payment_method) VALUES (?,?, ?, ?, ?, ?, ?)";
    const values = [
      orderCode,
      user_id,
      shipping_address,
      Provinces || null,
      Districts || null,
      total_amount,
      paymentMethod,
    ];

    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error("Lỗi khi thêm đơn hàng:", err); // Log chi tiết lỗi
        return connection.rollback(() => {
          res.status(500).json({ error: "Lỗi khi thêm đơn hàng" });
        });
      }

      const orderId = results.insertId;

      // Chèn vào bảng order_detail và thêm user_id
      const orderDetailSql =
        "INSERT INTO order_items (	order_id	, product_id, total_quantity, product_price) VALUES ?";
      const orderDetailValues = orderItems.map((item) => [
        orderId,
        item.product_id,
        item.total_quantity,
        item.product_price,
      ]);

      // Kiểm tra log để đảm bảo dữ liệu order_detail chính xác
      console.log("Order Details:", orderDetailValues);

      // Kiểm tra log để đảm bảo dữ liệu order_detail chính xác
      console.log("Order Details:", orderDetailValues);

      connection.query(orderDetailSql, [orderDetailValues], (err) => {
        if (err) {
          console.error("Lỗi khi thêm vào order_detail:", err); // Log chi tiết lỗi
          return connection.rollback(() => {
            res.status(500).json({ error: "Lỗi khi thêm item vào đơn hàng" });
          });
        }

        // Cam kết giao dịch
        connection.commit((err) => {
          if (err) {
            console.error("Lỗi khi cam kết giao dịch:", err); // Log chi tiết lỗi
            return connection.rollback(() => {
              res.status(500).json({ error: "Lỗi khi cam kết giao dịch" });
            });
          }
          res.status(200).json({ message: "Đặt hàng thành công!" });
        });
      });
    });
  });
};
