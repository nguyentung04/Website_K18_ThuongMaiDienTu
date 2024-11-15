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
        FROM review_detail rd
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

// Lấy đánh giá theo ID sản phẩm
exports.getReviewsByProductID = async (req, res) => {
  try {
    const { product_id } = req.params;

    const selectQuery = `
      SELECT r.id AS review_id, u.username, rd.content, rd.rating, rd.created_at, rd.id
      FROM product_reviews r
      JOIN review_detail rd ON r.id = rd.review_id
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at ASC;
    `;

    const [reviews] = await connection.promise().query(selectQuery, [product_id]);

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error.message);
    res.status(500).send("Có lỗi xảy ra khi lấy danh sách đánh giá.");
  }
};

// Đăng đánh giá cho sản phẩm
exports.postReviewByProductID = async (req, res) => {
  try {
      const { product_id } = req.params;
      const { user_id, content, rating } = req.body;

      if (rating < 1 || rating > 5) {
          return res.status(400).send("Rating phải nằm trong khoảng từ 1 đến 5.");
      }

      // Kiểm tra product_id có tồn tại không
      const [productRows] = await connection.promise().query(
          "SELECT id FROM products WHERE id = ?",
          [product_id]
      );

      if (productRows.length === 0) {
          return res.status(404).send("Sản phẩm không tồn tại.");
      }

      await connection.promise().beginTransaction();

      const insertReviewQuery = `
          INSERT INTO product_reviews (product_id, user_id, rating, content)
          VALUES (?, ?, ?, ?);
      `;
      await connection.promise().query(insertReviewQuery, [product_id, user_id, rating, content]);

      await connection.promise().commit();

      res.status(201).send("Đánh giá đã được thêm thành công.");
  } catch (error) {
      console.error("Lỗi khi thêm đánh giá:", error.message);
      await connection.promise().rollback();
      res.status(500).send("Có lỗi xảy ra khi thêm đánh giá.");
  }
};


// Đăng phản hồi theo review_detail_id
exports.postReplyByReviewDetailID = async (req, res) => {
  try {
    const { user_id, content } = req.body;
    const detail_id = req.params.detail_id;

    if (!content) {
      return res.status(400).send("Nội dung phản hồi không được để trống.");
    }

    const checkDetailQuery = `
      SELECT * FROM product_reviews WHERE id = ?;
    `;
    const [rows] = await connection.promise().query(checkDetailQuery, [detail_id]);

    if (rows.length === 0) {
      return res.status(404).send("Không tìm thấy detail_id trong bảng review_detail.");
    }

    await connection.promise().beginTransaction();

    const insertReplyQuery = `
      INSERT INTO reply (detail_id, user_id, content)
      VALUES (?, ?, ?);
    `;
    await connection.promise().query(insertReplyQuery, [detail_id, user_id, content]);

    await connection.promise().commit();

    res.status(201).send("Phản hồi đã được thêm thành công.");
  } catch (error) {
    console.error("Lỗi khi thêm phản hồi:", error.message);
    await connection.promise().rollback();
    res.status(500).send("Có lỗi xảy ra khi thêm phản hồi.");
  }
};

// Lấy danh sách phản hồi theo review_detail_id
exports.getRepliesByReviewDetailID = async (req, res) => {
  try {
    const { detail_id } = req.params;

    const getRepliesQuery = `
      SELECT r.id, r.user_id, r.content, r.created_at, u.username
      FROM reply r
      JOIN users u ON r.user_id = u.id
      WHERE r.detail_id = ?;
    `;
    
    const countRepliesQuery = `
      SELECT COUNT(*) AS count
      FROM reply
      WHERE detail_id = ?;
    `;

    const [repliesRows] = await connection.promise().query(getRepliesQuery, [detail_id]);
    const [[countRow]] = await connection.promise().query(countRepliesQuery, [detail_id]);

    if (repliesRows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phản hồi nào cho đánh giá này." });
    }

    res.status(200).json({
      success: true,
      message: "Lấy phản hồi thành công.",
      replies: repliesRows,
      replyCount: countRow.count,
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

