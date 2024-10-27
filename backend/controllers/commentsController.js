
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


//tung
//lấy cmt theo tung id san pham
exports.getCommentsByProductID = async (req, res) => {
  try {
    const { product_id } = req.params;

    const selectQuery = `
      SELECT c.id AS comment_id, u.username, cd.content, cd.rating, cd.created_at,cd.id
      FROM comments c
      JOIN comment_detail cd ON c.id = cd.comment_id
      JOIN users u ON c.user_id = u.id
      WHERE c.product_id = ?
      ORDER BY c.created_at ASC;
    `;

    // Thực hiện query để lấy danh sách bình luận và đánh giá
    const [comments] = await connection.promise().query(selectQuery, [product_id]);

    res.status(200).json(comments);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bình luận:", error.message);
    res.status(500).send("Có lỗi xảy ra khi lấy danh sách bình luận.");
  }
};

//binh luan
exports.postCommentByProductID = async (req, res) => {
  try {
    const { product_id, user_id, content, rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).send("Rating phải nằm trong khoảng từ 1 đến 5.");
    }

    await connection.promise().beginTransaction();

    const insertCommentQuery = `
      INSERT INTO comments (product_id, user_id)
      VALUES (?, ?);
    `;
    const [result] = await connection.promise().query(insertCommentQuery, [product_id, user_id]);

    const comment_id = result.insertId;

    const insertCommentDetailQuery = `
      INSERT INTO comment_detail (comment_id, content, rating)
      VALUES (?, ?, ?);
    `;
    await connection.promise().query(insertCommentDetailQuery, [comment_id, content, rating]);

    await connection.promise().commit();

    res.status(201).send("Bình luận và đánh giá đã được thêm thành công.");
  } catch (error) {
    console.error("Lỗi khi thêm bình luận và đánh giá:", error.message);
    await connection.promise().rollback();
    res.status(500).send("Có lỗi xảy ra khi thêm bình luận và đánh giá.");
  }
};



//reply 
exports.postReplyByCommentDetailID = async (req, res) => {
  try {
    const { user_id, content } = req.body;
    const detail_id = req.params.detail_id; // Lấy detail_id từ params

    // Kiểm tra nội dung phản hồi không được rỗng
    if (!content) {
      return res.status(400).send("Nội dung phản hồi không được để trống.");
    }

    // Kiểm tra xem detail_id có tồn tại trong bảng comment_detail không
    const checkDetailQuery = `
      SELECT * FROM comment_detail WHERE id = ?;
    `;
    const [rows] = await connection.promise().query(checkDetailQuery, [detail_id]);

    if (rows.length === 0) {
      return res.status(404).send("Không tìm thấy detail_id trong bảng comment_detail.");
    }

    // Bắt đầu transaction để thêm vào bảng reply
    await connection.promise().beginTransaction();

    // Thêm phản hồi vào bảng reply
    const insertReplyQuery = `
      INSERT INTO reply (detail_id, user_id, content)
      VALUES (?, ?, ?);
    `;
    await connection.promise().query(insertReplyQuery, [detail_id, user_id, content]);

    // Commit transaction
    await connection.promise().commit();

    res.status(201).send("Phản hồi đã được thêm thành công.");
  } catch (error) {
    console.error("Lỗi khi thêm phản hồi:", error.message);

    // Rollback transaction nếu có lỗi
    await connection.promise().rollback();
    res.status(500).send("Có lỗi xảy ra khi thêm phản hồi.");
  }
};




// Lấy danh sách phản hồi theo comment_detail_id
exports.getRepliesByCommentDetailID = async (req, res) => {
  try {
    const { detail_id } = req.params; // Lấy detail_id từ tham số URL
    
    // Log để kiểm tra detail_id được truyền vào
    console.log("detail_id:", detail_id);
    
    // Truy vấn để lấy phản hồi từ bảng reply theo detail_id
    const getRepliesQuery = `
      SELECT r.id, r.user_id, r.content, r.created_at, u.username
      FROM reply r
      JOIN users u ON r.user_id = u.id
      WHERE r.detail_id = ?;
    `;
    
    // Truy vấn để đếm số lượng phản hồi
    const countRepliesQuery = `
      SELECT COUNT(*) AS count
      FROM reply
      WHERE detail_id = ?;
    `;

    // Log câu truy vấn và detail_id sử dụng để kiểm tra trong trường hợp có lỗi
    console.log("Query:", getRepliesQuery);
    console.log("Detail ID trong truy vấn:", [detail_id]);
    
    // Thực hiện cả hai truy vấn đồng thời
    const [repliesRows] = await connection.promise().query(getRepliesQuery, [detail_id]);
    const [[countRow]] = await connection.promise().query(countRepliesQuery, [detail_id]);

    // Log kết quả truy vấn
    console.log("Kết quả truy vấn phản hồi:", repliesRows);
    console.log("Số lượng phản hồi:", countRow.count);
    
    // Kiểm tra xem có phản hồi nào không
    if (repliesRows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phản hồi nào cho đánh giá này." });
    }

    // Gửi phản hồi về cho client
    res.status(200).json({
      success: true,
      message: "Lấy phản hồi thành công.",
      replies: repliesRows,
      replyCount: countRow.count, // Trả về số lượng phản hồi
    });
  } catch (error) {
    // Log chi tiết lỗi
    console.error("Chi tiết lỗi khi lấy phản hồi:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy phản hồi.",
      error: error.message,
    });
  }
};

exports.getReplyCountByDetailID = (req, res) => {
  const detail_id = req.params.detail_id; // Lấy detail_id từ tham số URL

  // Kiểm tra xem detail_id có hợp lệ hay không
  if (!detail_id) {
      return res.status(400).json({ success: false, message: 'detail_id không hợp lệ' });
  }

  // Sử dụng connection để thực hiện truy vấn
  connection.query('SELECT COUNT(*) AS replyCount FROM reply WHERE detail_id = ?', [detail_id], (error, results) => {
      if (error) {
          console.error('Lỗi khi truy vấn:', error);
          return res.status(500).json({ success: false, message: 'Lỗi khi lấy số lượng phản hồi' });
      }
      
      const replyCount = results[0].replyCount;
      return res.json({ success: true, replyCount });
  });
};
