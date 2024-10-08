

const connection = require('../config/database');

exports.getAllComment_detail = (req, res) => {
    connection.query('SELECT * FROM `comment_detail`;', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  };
  


exports.getCommentDetailById = (req, res) => {
    const commentId = parseInt(req.params.id); // Lấy order_id từ tham số URL

  // Thực hiện truy vấn SQL
  connection.query(
    `SELECT 
    c.*,
    ct.*
FROM
     comment_detail ct
JOIN comments c ON ct.comment_id = c.id
WHERE  c.id = ?  ;                       -- Chỉ hiển thị dữ liệu với id của comments là 1`,
    [commentId], // Thay thế dấu hỏi bằng giá trị của orderId
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message }); // Trả về lỗi với trạng thái 500 nếu có vấn đề
      }
      res.status(200).json(results); // Trả về kết quả truy vấn dưới dạng JSON
    }
  );
};

exports.deleteComment_detail = (req, res) => {
    const deletingId = req.params.id; // Use consistent camelCase naming
  
    // Prepare the SQL query to delete the comment detail
    const query = "DELETE FROM Comment_detail WHERE id = ?";
  
    // Execute the query
    connection.query(query, [deletingId], (err, results) => {
      if (err) {
        // Log the error and respond with a 500 status code
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi khi xóa bình luận." });
      }
  
      // Check if any rows were affected (i.e., if the comment detail was deleted)
      if (results.affectedRows === 0) {
        // If no rows were affected, respond with a 404 status code
        return res.status(404).json({ message: "Không tìm thấy bình luận" });
      }
  
      // Respond with a success message
      res.status(200).json({ message: "Bình luận đã bị xóa thành công" });
    });
  };
  
  