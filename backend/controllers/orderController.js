const connection = require("../config/database");

//lấy tất cả đơn hàng
exports.getAllOrders = (req, res) => {
  connection.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

//lấy toàn bộ đơn hàng theo name
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


exports.orderByName1 = (req, res) => {
  const { id } = req.params;

  // Kiểm tra xem id có hợp lệ không
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid order ID' });
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
        return res.status(500).json({ error: 'Database query error: ' + err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json(results);
    }
  );
};





//lấy toàn bộ đơn hàng theo id

exports.getOrderById = (req, res) => {
  const orderId = parseInt(req.params.id); // Lấy order_id từ tham số URL

  // Thực hiện truy vấn SQL
  connection.query(
    `SELECT 
       o.*,        
       od.*        
     FROM orders o
     JOIN order_detail od ON o.id = od.order_id
     WHERE o.id = ?`, // Sử dụng dấu hỏi để bảo mật SQL Injection
    [orderId], // Thay thế dấu hỏi bằng giá trị của orderId
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};

//xóa toàn bộ đơn hàng theo order_id
exports.deleteOrder = (req, res) => {
  const { id } = req.params;

  // Bắt đầu transaction
  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Xóa chi tiết đơn hàng trước
    connection.query(
      "DELETE FROM order_detail WHERE order_id = ?",
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


exports.getAllOrders = (req, res) => {
  connection.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

//them vo giỏ hàng
exports.PostOrders = (req, res) => {
  const { name, phone, address, paymentMethod, order_detail } = req.body;

  if (!name || !phone || !address || !paymentMethod || !order_detail) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết" });
  }

  // Bắt đầu giao dịch để đảm bảo toàn vẹn dữ liệu
  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi bắt đầu giao dịch" });
    }

    // Thêm đơn hàng vào bảng orders
    const sql =
      "INSERT INTO orders (name, phone, address, paymentMethod) VALUES (?, ?, ?, ?)";
    const values = [name, phone, address, paymentMethod];

    connection.query(sql, values, (err, results) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ error: "Lỗi khi thêm đơn hàng" });
        });
      }

      const orderId = results.insertId;
      const orderDetailSql =
        "INSERT INTO order_detail (order_id, product_id, quantity, price, total) VALUES ?";
      const orderDetailValues = order_detail.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
        item.price * item.quantity, // Tính giá trị tổng
      ]);

      connection.query(orderDetailSql, [orderDetailValues], (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: "Lỗi khi thêm item vào đơn hàng" });
          });
        }

        // Cam kết giao dịch
        connection.commit((err) => {
          if (err) {
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


