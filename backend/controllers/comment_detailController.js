const connection = require("../config/database");

// 1. Lấy tất cả chi tiết bình luận
exports.getAllCommentDetails = (req, res) => {
  const query = `
    SELECT
      rd.id AS detail_id,
      rd.content AS detail_content,
      rd.created_at AS detail_created_at,
      r.id AS review_id,
      r.content AS review_content,
      u.id AS user_id,
      u.name AS fullname,
      p.id AS product_id,
      p.name AS product_name
    FROM review_detail rd
    JOIN product_reviews r ON rd.review_id = r.id
    JOIN users u ON rd.user_id = u.id
    JOIN products p ON r.product_id = p.id
    ORDER BY rd.created_at DESC;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// 2. Lấy chi tiết bình luận theo ID
exports.getCommentDetailById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT
      rd.id AS detail_id,
      rd.content AS detail_content,
      rd.created_at AS detail_created_at,
      r.id AS review_id,
      r.content AS review_content,
      u.id AS user_id,
      u.name AS fullname,
      p.id AS product_id,
      p.name AS product_name
    FROM review_detail rd
    JOIN product_reviews r ON rd.review_id = r.id
    JOIN users u ON rd.user_id = u.id
    JOIN products p ON r.product_id = p.id
    WHERE rd.id = ?;
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Lỗi khi lấy chi tiết bình luận." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy chi tiết bình luận." });
    }
    res.status(200).json(results[0]);
  });
};

// 3. Xóa chi tiết bình luận theo ID
exports.deleteCommentDetail = (req, res) => {
  const { id } = req.params;
  const deleteQuery = `DELETE FROM review_detail WHERE id = ?`;

  connection.query(deleteQuery, [id], (err, results) => {
    if (err) {
      console.error("Error deleting comment detail:", err.message);
      return res.status(500).json({ error: "Lỗi khi xóa chi tiết bình luận." });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy chi tiết bình luận để xóa." });
    }
    res.status(200).json({ message: "Đã xóa chi tiết bình luận thành công." });
  });
};

// 4. Đăng chi tiết bình luận mới
exports.postCommentDetail = (req, res) => {
  const { review_id, user_id, content } = req.body;
  const insertQuery = `
    INSERT INTO review_detail (review_id, user_id, content)
    VALUES (?, ?, ?);
  `;

  connection.query(insertQuery, [review_id, user_id, content], (err, results) => {
    if (err) {
      console.error("Error inserting comment detail:", err.message);
      return res.status(500).json({ error: "Lỗi khi thêm chi tiết bình luận." });
    }
    res.status(201).json({ message: "Đã thêm chi tiết bình luận thành công.", detailId: results.insertId });
  });
};

// 5. Lấy danh sách phản hồi cho chi tiết bình luận
exports.getRepliesByCommentDetailID = (req, res) => {
  const { detail_id } = req.params;
  const getRepliesQuery = `
    SELECT r.id, r.user_id, r.content, r.created_at, u.username
    FROM reply r
    JOIN users u ON r.user_id = u.id
    WHERE r.detail_id = ?;
  `;

  connection.query(getRepliesQuery, [detail_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Lỗi khi lấy danh sách phản hồi." });
    }
    res.status(200).json(results);
  });
};

// 6. Đăng phản hồi cho chi tiết bình luận
exports.postReplyByCommentDetailID = (req, res) => {
  const { user_id, content } = req.body;
  const detail_id = req.params.detail_id;

  if (!content) {
    return res.status(400).send("Nội dung phản hồi không được để trống.");
  }

  const insertReplyQuery = `
    INSERT INTO reply (detail_id, user_id, content)
    VALUES (?, ?, ?);
  `;

  connection.query(insertReplyQuery, [detail_id, user_id, content], (err, results) => {
    if (err) {
      console.error("Error inserting reply:", err.message);
      return res.status(500).json({ error: "Lỗi khi thêm phản hồi." });
    }
    res.status(201).json({ message: "Phản hồi đã được thêm thành công.", replyId: results.insertId });
  });
};

// 7. Đếm số lượng phản hồi theo chi tiết bình luận
exports.getReplyCountByDetailID = (req, res) => {
  const { detail_id } = req.params;
  const countQuery = `
    SELECT COUNT(*) AS replyCount
    FROM reply
    WHERE detail_id = ?;
  `;

  connection.query(countQuery, [detail_id], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Lỗi khi đếm số lượng phản hồi." });
    }
    res.status(200).json({ replyCount: results[0].replyCount });
  });
};
