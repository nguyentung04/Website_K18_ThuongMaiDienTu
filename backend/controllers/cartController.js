const connection = require("../config/database");

// Lấy tất cả bài đăng
exports.getAllcart = (req, res) => {
  connection.query(
    `SELECT 

	  u.name AS name,
    pr.name AS pr_name, -- Tên sản phẩm
    pr.price AS pr_price,
    SUM(c_i.quantity) AS total_quantity, -- Tổng số lượng sản phẩm
    SUM(c_i.quantity * c_i.price) AS total_price, -- Tổng giá trị (số lượng * giá)
    MIN(ca.created_at) AS first_added, -- Ngày thêm đầu tiên
    MIN(ca.updated_at) AS last_updated -- Ngày cập nhật cuối cùng
FROM 
    cart ca
JOIN 
    cart_items c_i ON c_i.cart_id = ca.id -- Kết nối với bảng cart_items
JOIN 
    products pr ON c_i.product_id = pr.id -- Kết nối với bảng products
LEFT JOIN 
    users u ON ca.user_id = u.id -- Kết nối với bảng users
GROUP BY 
  pr.name,u.name,pr.price; -- Nhóm theo tên sản phẩm`,
    (err, results) => {
      if (err) {
        // Trả về lỗi nếu có sự cố khi truy vấn CSDL
        return res.status(500).json({ error: err.message });
      }
      // Trả về danh sách bài đăng
      res.status(200).json(results);
    }
  );
};

// Lấy bài đăng theo ID
exports.getCartById = (req, res) => {
  const user_id = req.params.id; // Lấy cartId từ tham số request

  // Truy vấn CSDL để lấy dữ liệu giỏ hàng theo ID
  connection.query(
    `


    SELECT 


    ca.id AS cart_id,
     c_i.quantity AS total_quantity,
     c_i.price AS product_price,
     c_i.total AS total_amout ,
     pr.name AS product_name,
     pr.id AS product_id,
   pi.image_url AS images
 
     FROM 
         cart ca
     JOIN 
         cart_items c_i ON c_i.cart_id = ca.id -- Kết nối với bảng cart_items
     JOIN 
         products pr ON c_i.product_id = pr.id -- Kết nối với bảng products
     JOIN
     	product_images pi ON pr.id = pi.product_id
     LEFT JOIN 
         users u ON ca.user_id = u.id -- Kết nối với bảng users
     WHERE 
         ca.user_id = ? -- Lọc theo cart_id
  
    `,
    [user_id], // Sử dụng tham số hóa để bảo vệ khỏi SQL Injection
    (err, results) => {
      if (err) {
        // Ghi lại lỗi và phản hồi lỗi
        console.error("Lỗi truy vấn CSDL:", err);
        return res
          .status(500)
          .json({ error: "Có lỗi xảy ra khi lấy dữ liệu giỏ hàng." });
      }

      // Trả về kết quả là danh sách sản phẩm trong giỏ hàng
      res.status(200).json(results);
    }
  );
};
exports.getCartById1 = (req, res) => {
  const user_id = req.params.id; // Lấy cartId từ tham số request

  // Truy vấn CSDL để lấy dữ liệu giỏ hàng theo ID
  connection.query(
    `
 SELECT ca.*,c_i.*
  FROM cart ca
   JOIN cart_items c_i ON c_i.cart_id = ca.id -- Kết nối với bảng cart_items 
   JOIN products pr ON c_i.product_id = pr.id -- Kết nối với bảng products
    LEFT JOIN users u ON ca.user_id = u.id -- Kết nối với bảng users
  WHERE ca.user_id = ? -- Lọc theo cart_id;
    `,
    [user_id], // Sử dụng tham số hóa để bảo vệ khỏi SQL Injection
    (err, results) => {
      if (err) {
        // Ghi lại lỗi và phản hồi lỗi
        console.error("Lỗi truy vấn CSDL:", err);
        return res
          .status(500)
          .json({ error: "Có lỗi xảy ra khi lấy dữ liệu giỏ hàng." });
      }

      // Trả về kết quả là danh sách sản phẩm trong giỏ hàng
      res.status(200).json(results);
    }
  );
};
// // Xóa bài đăng theo ID
exports.deleteCartItem = (req, res) => {
  const product_id = req.params.productId; // Lấy product_id từ params
  const user_id = req.params.userId; // Lấy user_id từ params

  // Câu truy vấn SQL để xóa sản phẩm khỏi giỏ hàng dựa trên product_id và user_id
  const query = `DELETE c_i
FROM cart_items c_i
JOIN cart ca ON ca.id = c_i.cart_id
WHERE c_i.product_id = ? AND ca.user_id = ?;
`;

  try {
    // Thực hiện câu truy vấn
    connection.query(query, [product_id, user_id], (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn CSDL:", err.message); // Ghi lại lỗi chi tiết
        return res
          .status(500)
          .json({ error: "Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng." });
      }

      // Kiểm tra nếu không có hàng nào bị ảnh hưởng
      if (results.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Không tìm thấy sản phẩm trong giỏ hàng với thông tin cung cấp.",
        });
      }

      // Phản hồi thành công khi sản phẩm đã được xóa
      res.status(200).json({
        message: "Sản phẩm đã được xóa khỏi giỏ hàng thành công.",
      });
    });
  } catch (error) {
    console.error("Lỗi server:", error.message); // Log lỗi server
    return res
      .status(500)
      .json({ error: "Đã xảy ra lỗi không mong muốn trên server." });
  }
};

// // Xóa bài đăng theo user_id
exports.deleteCartUser_id = (req, res) => {
  const { id } = req.params; // Lấy user_id từ params

  // // Kiểm tra nếu user_id không tồn tại
  // if (!user_id) {
  //   return res.status(400).json({
  //     error: "Dữ liệu đầu vào không hợp lệ. Vui lòng cung cấp user_id.",
  //   });
  // }

  // Thực hiện xóa giỏ hàng dựa trên user_id
  const query = "DELETE FROM cart WHERE user_id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn CSDL:", err);
      return res.status(500).json({ error: "Có lỗi xảy ra khi xóa giỏ hàng." });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giỏ hàng để xóa." });
    }

    res.status(200).json({ message: "Giỏ hàng đã được xóa thành công." });
  });
};

// =========================================================================================================================
// // Cập nhật giỏ hàng
exports.updateCartItems = (req, res) => {
  const { cart_items } = req.body; // Chỉ cần danh sách sản phẩm
  const userId = req.params.userId; // Lấy userId từ params

  if (!userId || !Array.isArray(cart_items) || cart_items.length === 0) {
    return res.status(400).json({
      error:
        "Dữ liệu đầu vào không hợp lệ. Vui lòng cung cấp userId và danh sách sản phẩm.",
    });
  }

  // Kiểm tra định dạng của từng sản phẩm
  for (const item of cart_items) {
    if (!item.product_id || !item.total_quantity || !item.product_price) {
      return res.status(400).json({
        error:
          "Sản phẩm không hợp lệ. Mỗi sản phẩm cần có product_id, total_quantity và product_price.",
      });
    }
  }

  connection.beginTransaction((transactionErr) => {
    if (transactionErr) {
      console.error("Transaction error:", transactionErr);
      return res.status(500).json({ error: "Không thể khởi tạo giao dịch." });
    }

    // Truy vấn để lấy cart_id dựa trên userId
    const getCartQuery = "SELECT id AS cart_id FROM cart WHERE user_id = ?";
    connection.query(getCartQuery, [userId], (getCartErr, results) => {
      if (getCartErr || results.length === 0) {
        console.error("Get cart error:", getCartErr);
        return connection.rollback(() => {
          res.status(404).json({
            error: "Không tìm thấy giỏ hàng cho người dùng này.",
          });
        });
      }

      const cart_id = results[0].cart_id;

      const updatePromises = cart_items.map((item) => {
        const { product_id, total_quantity, product_price } = item;
        const total = total_quantity * product_price;

        // Câu lệnh SQL để cập nhật sản phẩm
        const updateQuery = `
        UPDATE cart_items 
        SET quantity = ?, price = ?
        WHERE cart_id = ? AND product_id = ?`;
       console.log("Running SQL:", updateQuery, [total_quantity, product_price, cart_id, product_id]);
      return new Promise((resolve, reject) => {
        connection.query(
          updateQuery,
          [total_quantity, product_price, cart_id, product_id],
          (updateErr, result) => {
            if (updateErr) {
              return reject(updateErr);
            }
            if (result.affectedRows === 0) {
              // Không tìm thấy sản phẩm để cập nhật
              return reject(
                new Error(`Sản phẩm với product_id=${product_id} không tồn tại trong giỏ hàng.`)
              );
            }
            resolve(result);
          }
        );
      });
      
       

      
      });

      Promise.all(updatePromises)
        .then(() => {
          connection.commit((commitErr) => {
            if (commitErr) {
              console.error("Commit error:", commitErr);
              return connection.rollback(() => {
                res.status(500).json({
                  error: "Không thể hoàn tất giao dịch.",
                  details: commitErr.message,
                });
              });
            }

            res.status(200).json({
              message: "Giỏ hàng đã được cập nhật thành công.",
            });
          });
        })
        .catch((err) => {
          console.error("Update error:", err);
          connection.rollback(() => {
            res.status(500).json({
              error: "Không thể cập nhật sản phẩm trong giỏ hàng.",
              details: err.message,
            });
          });
        });
    });
  });
};

// =======================================================================================================
exports.postCart = (req, res) => {
  const { user_id, cart_items } = req.body;

  if (!user_id || !Array.isArray(cart_items) || cart_items.length === 0) {
    return res.status(400).json({
      error:
        "Dữ liệu đầu vào không hợp lệ. Vui lòng cung cấp user_id và danh sách sản phẩm.",
    });
  }

  // Kiểm tra định dạng của từng sản phẩm
  for (const item of cart_items) {
    if (!item.product_id || !item.quantity || !item.price) {
      return res.status(400).json({
        error:
          "Sản phẩm không hợp lệ. Mỗi sản phẩm cần có product_id, quantity và price.",
      });
    }
  }

  // Bắt đầu giao dịch
  connection.beginTransaction((transactionErr) => {
    if (transactionErr) {
      console.error("Transaction error:", transactionErr);
      return res.status(500).json({ error: "Không thể khởi tạo giao dịch." });
    }

    // Kiểm tra xem user_id đã tồn tại trong bảng cart hay chưa
    const checkCartQuery = "SELECT id AS cart_id FROM cart WHERE user_id = ?";
    connection.query(checkCartQuery, [user_id], (checkCartErr, results) => {
      if (checkCartErr) {
        console.error("Check cart error:", checkCartErr);
        return connection.rollback(() => {
          res.status(500).json({
            error: "Không thể kiểm tra giỏ hàng.",
            details: checkCartErr.message,
          });
        });
      }

      let cart_id;

      if (results.length > 0) {
        // Giỏ hàng đã tồn tại, lấy cart_id
        cart_id = results[0].cart_id;
      } else {
        // Giỏ hàng chưa tồn tại, tạo mới
        const insertCartQuery = "INSERT INTO cart (user_id) VALUES (?)";
        connection.query(insertCartQuery, [user_id], (insertCartErr, cartResult) => {
          if (insertCartErr) {
            console.error("Insert cart error:", insertCartErr);
            return connection.rollback(() => {
              res.status(500).json({
                error: "Không thể thêm giỏ hàng.",
                details: insertCartErr.message,
              });
            });
          }
          cart_id = cartResult.insertId;
          processCartItems();
        });
        return;
      }

      // Nếu đã có cart_id, tiếp tục xử lý cart_items
      processCartItems();

      function processCartItems() {
        const cartItemsData = cart_items.map((item) => [
          cart_id,
          item.product_id,
          item.quantity,
          item.price,
        ]);

        const cartItemsQuery = `
          INSERT INTO cart_items (cart_id, product_id, quantity, price)
          VALUES ?
          ON DUPLICATE KEY UPDATE
            quantity = quantity + VALUES(quantity),
            price = VALUES(price)
           
        `;

        connection.query(cartItemsQuery, [cartItemsData], (itemsErr) => {
          if (itemsErr) {
            console.error("Insert/Update cart_items error:", itemsErr);
            return connection.rollback(() => {
              res.status(500).json({
                error: "Không thể thêm sản phẩm vào giỏ hàng.",
                details: itemsErr.message,
              });
            });
          }

          connection.commit((commitErr) => {
            if (commitErr) {
              console.error("Commit error:", commitErr);
              return connection.rollback(() => {
                res.status(500).json({
                  error: "Không thể hoàn tất giao dịch.",
                  details: commitErr.message,
                });
              });
            }

            // Thành công
            res.status(200).json({
              message: "Giỏ hàng đã được cập nhật thành công.",
            });
          });
        });
      }
    });
  });
};


