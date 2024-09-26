
const connection = require("../config/database");

// Example function to get all categoris
exports.getAllComments = (req, res) => {
  connection.query(
    `SELECT
  u.id AS user_id,            
  u.name AS fullname,         
  p.*,       
  c.*        
    FROM comments c
    JOIN users u ON c.user_id = u.id
    JOIN products p ON c.product_id = p.id
`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};

exports.getCommentsById = (req, res) => {
  const commentId = req.params.id; //Sử dụng cách đặt tên camelCase nhất quán

  // Query the database to get user by ID
  connection.query(
    "SELECT * FROM comments WHERE id = ?", // SQL query
    [commentId], // Truy vấn tham số hóa để ngăn chặn SQL injection
    (err, results) => {
      if (err) {
        // Ghi lại lỗi và phản hồi bằng mã trạng thái 500
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching the user." });
      }

      if (results.length === 0) {
        // Nếu không tìm thấy người dùng, hãy trả lời bằng mã trạng thái 404
        return res.status(404).json({ message: "User not found" });
      }

      // Respond with the user data
      res.status(200).json(results[0]);
    }
  );
};

exports.postCommentCounts = async (req, res) => {
  try {
    const updateQuery = `
      UPDATE comments c
      SET c.count = (
        SELECT COUNT(*)
        FROM comment_detail ct
        WHERE ct.comment_id = c.id
      );
    `;
    
    // Execute the query using a promise-based method
    await connection.promise().query(updateQuery);
    
    res.status(200).send("Comment counts updated successfully.");
  } catch (error) {
    console.error("Error updating comment counts:", error.message);
    res.status(500).send("Error updating comment counts.");
  }
};


