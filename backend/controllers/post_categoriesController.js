const connection = require("../config/database");

// Lấy tất cả bài đăng
exports.getAllpost_categories = (req, res) => {
    connection.query("SELECT * FROM post_categories ", (err, results) => {
      if (err) {
        // Trả về lỗi nếu có sự cố khi truy vấn CSDL
        return res.status(500).json({ error: err.message });
      }
      // Trả về danh sách bài đăng
      res.status(200).json(results);
    });
};


// Lấy bài đăng theo ID
exports.getPost_categoriesId = (req, res) => {
  const postId = req.params.id; // Sử dụng cách đặt tên camelCase nhất quán

  // Truy vấn CSDL để lấy bài đăng theo ID
  connection.query(
    "SELECT * FROM post_categories WHERE id = ?", // Truy vấn SQL
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
exports.deletePost_categories = (req, res) => {
  const postId = req.params.id; // Lấy ID danh mục từ params

  // Kiểm tra xem danh mục có chứa bài viết nào không
  const checkPostQuery = "SELECT COUNT(*) AS postCount FROM posts WHERE post_categories_id = ?";

  connection.query(checkPostQuery, [postId], (err, results) => {
    if (err) {
      console.error("Lỗi khi kiểm tra bài viết trong danh mục:", err);
      return res.status(500).json({ error: "Có lỗi xảy ra khi kiểm tra bài viết trong danh mục." });
    }

    const postCount = results[0].postCount;

    if (postCount > 0) {
      // Nếu có bài viết trong danh mục, trả về thông báo lỗi
      return res.status(400).json({ message: "Không thể xóa danh mục vì có bài viết trong danh mục này." });
    }

    // Nếu không có bài viết, tiếp tục xóa danh mục
    const deleteQuery = "DELETE FROM post_categories WHERE id = ?";

    connection.query(deleteQuery, [postId], (err, results) => {
      if (err) {
        console.error("Lỗi khi xóa danh mục:", err);
        return res.status(500).json({ error: "Có lỗi xảy ra khi xóa danh mục." });
      }

      if (results.affectedRows === 0) {
        // Nếu không có danh mục nào bị xóa, trả về lỗi
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }

      // Phản hồi thành công khi xóa danh mục
      res.status(200).json({ message: "Danh mục đã được xóa thành công" });
    });
  });
};



// Cập nhật bài đăng theo ID
exports.updatePost_categories  = (req, res) => {
  const Post_categoriesId = req.params.id; // Sử dụng 'postId' để dễ hiểu hơn
  const { name} = req.body; // Nhận dữ liệu từ body

  // Log dữ liệu nhận được để kiểm tra
  console.log("Dữ liệu nhận được:", req.body);

  // Kiểm tra nếu thiếu trường bắt buộc
  if (!name  || !Post_categoriesId) {
    return res.status(400).json({ error: "Tất cả các trường (name, description) và ID bài đăng là bắt buộc." });
  }



  // Chuẩn bị câu truy vấn SQL để cập nhật bài đăng
  const query = `
    UPDATE post_categories
    SET name = ?
    WHERE id = ?;
  `;
  const values = [name, Post_categoriesId];

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
exports.postPost_categories  = (req, res) => {
  const {  name, description } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (! name ) {
    return res.status(400).json({ message: "Tất cả các trường ( name, description) là bắt buộc" });
  }

  // Chuẩn bị câu truy vấn SQL để tạo bài đăng
  const query = `
    INSERT INTO post_categories( name, description) 
    VALUES (?, ?);
  `;
  const values = [ name || "", description || ""];

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