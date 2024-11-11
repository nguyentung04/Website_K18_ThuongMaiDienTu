
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
    JOIN order_detail od ON o.id = od.order_id
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

// Lấy toàn bộ đơn hàng theo id
exports.orderByName1 = (req, res) => {
  const { id } = req.params;

  // Kiểm tra xem id có hợp lệ không
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }

  connection.query(
    `SELECT o.*, od.*, u.name AS users, pr.name AS product_name FROM orders o JOIN order_items od ON o.id = od.order_id JOIN users u ON u.id = o.user_id JOIN products pr ON pr.id = od.product_id WHERE o.id =  ?;`,
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
    JOIN order_detail od ON o.id = od.order_id
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
exports.getOrderById = (req, res) => {
  const orderId = parseInt(req.params.id);

  connection.query(
    `SELECT 
      o.*, 
      c.name AS city, 
      d.name AS district 
    FROM orders o
    LEFT JOIN cities c ON o.id_cities = c.id
    LEFT JOIN districts d ON o.id_districts = d.id
    WHERE o.id = ?`,
    [orderId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(results);
    }
  );
};

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
      "DELETE FROM order_items  WHERE order_id = ?",
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
    name,
    phone,
    address,
    id_cities,
    id_districts,
    paymentMethod,
    order_detail,
    user_id, // Thêm user_id vào đây
  } = req.body;

  // Kiểm tra log để đảm bảo user_id được truyền vào
  console.log('User ID:', user_id);

  if (!name || !phone || !address || !paymentMethod || !order_detail || !user_id) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết" });
  }

  // Bắt đầu giao dịch để đảm bảo toàn vẹn dữ liệu
  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi bắt đầu giao dịch" });
    }

    // Thêm đơn hàng vào bảng orders (không bao gồm user_id)
    const sql =
      "INSERT INTO orders (name, phone, address, id_cities, id_districts, paymentMethod) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
      name,
      phone,
      address,
      id_cities || null,
      id_districts || null,
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
        "INSERT INTO order_detail (order_id, product_id, quantity, price, total, user_id) VALUES ?";
      const orderDetailValues = order_detail.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
        item.price * item.quantity,
        user_id, // Thêm user_id vào mỗi dòng của order_detail
      ]);

      // Kiểm tra log để đảm bảo dữ liệu order_detail chính xác
      console.log('Order Details:', orderDetailValues);

      connection.query(orderDetailSql, [orderDetailValues], (err) => {
        if (err) {
          console.error('Lỗi khi thêm vào order_detail:', err); // Log chi tiết lỗi
          return connection.rollback(() => {
            res.status(500).json({ error: "Lỗi khi thêm item vào đơn hàng" });
          });
        }

        // Cam kết giao dịch
        connection.commit((err) => {
          if (err) {
            console.error('Lỗi khi cam kết giao dịch:', err); // Log chi tiết lỗi
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
