const connection = require("../config/database");

// Lấy tất cả bài đăng
exports.getAllposts = (req, res) => {
    connection.query("SELECT * FROM posts", (err, results) => {
      if (err) {
        // Trả về lỗi nếu có sự cố khi truy vấn CSDL
        return res.status(500).json({ error: err.message });
      }
      // Trả về danh sách bài đăng
      res.status(200).json(results);
    });
};

// Lấy bài đăng theo ID
exports.getPostsById = (req, res) => {
    const postId = req.params.id; // Sử dụng cách đặt tên camelCase nhất quán

    // Truy vấn CSDL để lấy bài đăng theo ID
    connection.query(
      "SELECT * FROM posts WHERE id = ?", // Truy vấn SQL
      [postId], // Truy vấn tham số hóa để ngăn chặn SQL injection
      (err, results) => {
        if (err) {
          // Ghi lại lỗi và phản hồi bằng mã trạng thái 500
          console.error("Lỗi truy vấn CSDL:", err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra khi lấy bài đăng." });
        }

        if (results.length === 0) {
          // Nếu không tìm thấy bài đăng, trả về mã trạng thái 404
          return res.status(404).json({ message: "Không tìm thấy bài đăng" });
        }

        // Trả về dữ liệu bài đăng
        res.status(200).json(results[0]);
      }
    );
};

// Xóa bài đăng theo ID
exports.deletePosts = (req, res) => {
    const postId = req.params.id; // Sử dụng cách đặt tên camelCase nhất quán

    // Chuẩn bị câu truy vấn SQL để xóa bài đăng
    const query = "DELETE FROM posts WHERE id = ?";

    // Thực hiện câu truy vấn
    connection.query(query, [postId], (err, results) => {
      if (err) {
        // Ghi lại lỗi và phản hồi bằng mã trạng thái 500
        console.error("Lỗi truy vấn CSDL:", err);
        return res
          .status(500)
          .json({ error: "Có lỗi xảy ra khi xóa bài đăng." });
      }

      // Kiểm tra nếu không có hàng nào bị ảnh hưởng (tức là không có bài đăng nào bị xóa)
      if (results.affectedRows === 0) {
        // Nếu không có hàng nào bị ảnh hưởng, trả về mã trạng thái 404
        return res.status(404).json({ message: "Không tìm thấy bài đăng" });
      }

      // Phản hồi thành công khi bài đăng đã được xóa
      res.status(200).json({ message: "Bài đăng đã được xóa thành công" });
    });
};

// Cập nhật bài đăng theo ID
exports.updatePosts = (req, res) => {
    const postId = req.params.id; // Sử dụng 'postId' để dễ hiểu hơn
    const { title, avt, content, author_id, post_categories_id } = req.body; // Nhận dữ liệu từ body

    // Log dữ liệu nhận được để kiểm tra
    console.log("Dữ liệu nhận được:", req.body);

    // Kiểm tra nếu thiếu trường bắt buộc
    if (!title || !content || !author_id || !post_categories_id || !postId) {
      return res.status(400).json({ error: "Tất cả các trường (title, content, author_id, post_categories_id) và ID bài đăng là bắt buộc." });
    }

    // Nếu không có ảnh đại diện (avt), gán giá trị null
    const avtValue = avt || null;

    // Chuẩn bị câu truy vấn SQL để cập nhật bài đăng
    const query = `
      UPDATE posts
      SET title = ?, content = ?, avt = ?, author_id = ?, post_categories_id = ?
      WHERE id = ?;
    `;
    const values = [title, content, avtValue, author_id, post_categories_id, postId];

    // Thực hiện câu truy vấn
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn CSDL:", err); // Ghi lại lỗi vào console
        return res.status(500).json({ error: "Lỗi truy vấn CSDL", details: err.message });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy bài đăng" });
      }

      res.status(200).json({ message: "Bài đăng đã được cập nhật thành công" });
    });
};

// Tạo mới bài đăng
exports.postPosts = (req, res) => {
    const { title, avt, content, author_id, post_categories_id} = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!title || !content || !author_id || !post_categories_id ) {
      return res.status(400).json({ message: "Tất cả các trường (title, content, author_id, post_categories_id) là bắt buộc" });
    }

    // Chuẩn bị câu truy vấn SQL để tạo bài đăng
    const query = `
      INSERT INTO posts(title, content, avt, author_id, post_categories_id) 
      VALUES (?, ?, ?, ?, ?);
    `;
    const values = [title || "", content || "", avt || "", author_id || "", post_categories_id || ""];

    // Thực hiện câu truy vấn
    connection.query(query, values, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "Bài đăng đã được tạo thành công",
        postId: results.insertId, // Trả về ID của bài đăng vừa được tạo
      });
    });
};
