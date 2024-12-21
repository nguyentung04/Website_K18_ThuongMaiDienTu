const connection = require("../config/database");
// Lấy tất cả đánh giá sản phẩm
exports.getAllReviews = (req, res) => {
  connection.query(
    `SELECT
      u.id AS user_id,            
      u.name AS fullname,         
      p.id AS product_id,
      p.name, 
      p.*,       
      r.* 
    FROM product_reviews r
    JOIN users u ON r.user_id = u.id
    JOIN products p ON r.product_id = p.id`,

    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};

// Lấy đánh giá sản phẩm theo ID
exports.getReviewById = (req, res) => {
  const reviewId = req.params.id;

  connection.query(
    "SELECT * FROM product_reviews WHERE id = ?",
    [reviewId],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "An error occurred while fetching the review." });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.status(200).json(results[0]);
    }
  );
};

// Cập nhật số lượng đánh giá của sản phẩm
exports.updateReviewCounts = async (req, res) => {
  try {
    const updateQuery = `
      UPDATE product_reviews r
      SET r.count = (
        SELECT COUNT(*)
        FROM product_reviews rd
        WHERE rd.review_id = r.id
      );
    `;

    await connection.promise().query(updateQuery);
    res.status(200).send("Review counts updated successfully.");
  } catch (error) {
    console.error("Error updating review counts:", error.message);
    res.status(500).send("Error updating review counts.");
  }
};

// Lấy danh sách bình luận của sản phẩm
exports.getReviewsByProductID = async (req, res) => {
  try {
    const { productId } = req.params;
    const selectQuery = `
      SELECT 
        r.id AS review_id, 
        r.product_id,
        r.user_id,
        r.rating, 
        r.content, 
        r.created_at,
        u.username
      FROM product_reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC;
    `;

    const [reviews] = await connection.promise().query(selectQuery, [productId]);

    if (reviews.length === 0) {
      return res.status(404).json({ message: "Không có bình luận cho sản phẩm này." });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bình luận:", error.message);
    res.status(500).send("Có lỗi xảy ra khi lấy danh sách bình luận.");
  }
};

exports.postReviewByProductID = async (req, res) => {
  let transactionStarted = false;
  try {
    const { product_id } = req.params;
    const { user_id, content, rating, order_id } = req.body;

    console.log("Request body:", req.body);

    if (!user_id) {
      return res.status(400).send("User ID không hợp lệ.");
    }

    const [productRows] = await connection.promise().query(
      "SELECT id FROM products WHERE id = ?",
      [product_id]
    );

    if (productRows.length === 0) {
      return res.status(404).send("Sản phẩm không tồn tại.");
    }

    let validOrderId = order_id;
    if (!validOrderId) {
      const [orderRows] = await connection.promise().query(
        `SELECT o.id 
         FROM orders o 
         JOIN order_items oi ON o.id = oi.order_id 
         WHERE o.user_id = ? AND oi.product_id = ? LIMIT 1`,
        [user_id, product_id]
      );

      if (orderRows.length === 0) {
        return res.status(400).send("Không tìm thấy đơn hàng cho sản phẩm này.");
      }

      validOrderId = orderRows[0].id;
    }

    if (!validOrderId) {
      return res.status(400).send("Order ID không hợp lệ.");
    }

    await connection.promise().beginTransaction();
    transactionStarted = true;

    const insertReviewQuery = `
      INSERT INTO product_reviews (product_id, user_id, rating, content, created_at, updated_at, order_id)
      VALUES (?, ?, ?, ?, NOW(), NOW(), ?);
    `;

    await connection.promise().query(insertReviewQuery, [product_id, user_id, rating, content, validOrderId]);

    await connection.promise().commit();

    console.log("Đánh giá đã được thêm thành công cho sản phẩm:", product_id);

    res.status(201).send("Đánh giá đã được thêm thành công.");
  } catch (error) {
    console.error("Lỗi khi thêm đánh giá:", error.message);

    if (transactionStarted) {
      await connection.promise().rollback();
    }

    res.status(500).send("Có lỗi xảy ra khi thêm đánh giá.");
  }
};



// Cập nhật trả lời
exports.postReplyByReviewDetailID = async (req, res) => {
  try {
    const { user_id, content, review_id, parent_id } = req.body;

    if (!content) {
      return res.status(400).send("Nội dung phản hồi không được để trống.");
    }

    const checkReviewQuery = `
      SELECT * FROM product_reviews WHERE id = ?;
    `;
    const [rows] = await connection.promise().query(checkReviewQuery, [review_id]);

    if (rows.length === 0) {
      return res.status(404).send("Không tìm thấy review_id trong bảng product_reviews.");
    }

    await connection.promise().beginTransaction();

    const insertReplyQuery = `
      INSERT INTO reply (review_id, user_id, content, parent_id)
      VALUES (?, ?, ?, ?);
    `;
    const [replyResult] = await connection.promise().query(insertReplyQuery, [review_id, user_id, content, parent_id]);

    await connection.promise().commit();

    res.status(201).send({ replyId: replyResult.insertId, message: "Phản hồi đã được thêm thành công." });
  } catch (error) {
    console.error("Lỗi khi thêm phản hồi:", error.message);
    await connection.promise().rollback();
    res.status(500).send("Có lỗi xảy ra khi thêm phản hồi.");
  }
};


exports.getRepliesByReviewDetailID = async (req, res) => {
  try {
    const { detail_id } = req.params;

    const getRepliesQuery = `
      SELECT r.id, r.user_id, r.content, r.created_at, u.username
      FROM reply r
      JOIN users u ON r.user_id = u.id
      WHERE r.detail_id = ?;
    `;

    const [repliesRows] = await connection.promise().query(getRepliesQuery, [detail_id]);

    if (repliesRows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phản hồi nào cho đánh giá này." });
    }

    res.status(200).json({
      success: true,
      message: "Lấy phản hồi thành công.",
      replies: repliesRows,
    });
  } catch (error) {
    console.error("Chi tiết lỗi khi lấy phản hồi:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy phản hồi.",
      error: error.message,
    });
  }
};


// Đếm số phản hồi theo detail_id
exports.getReplyCountByDetailID = (req, res) => {
  const detail_id = req.params.detail_id;

  if (!detail_id) {
    return res.status(400).json({ success: false, message: 'detail_id không hợp lệ' });
  }

  connection.query('SELECT COUNT(*) AS replyCount FROM reply WHERE detail_id = ?', [detail_id], (error, results) => {
    if (error) {
      console.error('Lỗi khi truy vấn:', error);
      return res.status(500).json({ success: false, message: 'Lỗi khi lấy số lượng phản hồi' });
    }

    const replyCount = results[0].replyCount;
    return res.json({ success: true, replyCount });
  });
};

exports.getRepliesByReviewId = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const getRepliesQuery = `
      SELECT r.id, r.user_id, r.content, r.created_at, u.username AS reply_username, ur.username AS replied_username
      FROM reply r
      JOIN users u ON r.user_id = u.id
      JOIN product_reviews pr ON r.review_id = pr.id
      JOIN users ur ON pr.user_id = ur.id
      WHERE r.review_id = ?;
    `;

    const [repliesRows] = await connection.promise().query(getRepliesQuery, [reviewId]);

    if (repliesRows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phản hồi nào cho đánh giá này." });
    }

    const repliesWithMessages = repliesRows.map(reply => ({
      ...reply,
      message: `${reply.reply_username} đã trả lời ${reply.replied_username}`,
    }));

    res.status(200).json({
      success: true,
      message: "Lấy phản hồi thành công.",
      replies: repliesWithMessages,
    });
  } catch (error) {
    console.error("Lỗi khi lấy phản hồi:", error.message);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy phản hồi.",
      error: error.message,
    });
  }
};

