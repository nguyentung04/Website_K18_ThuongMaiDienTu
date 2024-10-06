const connection = require("../config/database");

// Example function to get all categoris
exports.getAlldistricts = (req, res) => {
  connection.query("SELECT * FROM districts", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

exports.getDistrictsById = (req, res) => {
  const categoryId = req.params.id; //Sử dụng cách đặt tên camelCase nhất quán

  // Query the database to get user by ID
  connection.query(
    "SELECT * FROM districts WHERE id = ?", // SQL query
    [categoryId], // Truy vấn tham số hóa để ngăn chặn SQL injection
    (err, results) => {
      if (err) {
        // Ghi lại lỗi và phản hồi bằng mã trạng thái 500
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi khi tìm kiếm quận/huyện" });
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

exports.deleteDistricts = (req, res) => {
  const categoryId = req.params.id; // Use consistent camelCase naming

  // Prepare the SQL query to delete the user
  const query = "DELETE FROM districts WHERE id = ?";

  // Execute the query
  connection.query(query, [categoryId], (err, results) => {
    if (err) {
      // Log the error and respond with a 500 status code
      console.error("Database query error:", err);
      return res
        .status(500)
        .json({ error: "Đã xảy ra lỗi khi xóa quận huyện." });
    }

    // Check if any rows were affected (i.e., if the user was deleted)
    if (results.affectedRows === 0) {
      // If no rows were affected, respond with a 404 status code
      return res.status(404).json({ message: "category not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "xoas quận huyện thành công" });
  });
};
exports.updateDistricts = (req, res) => {
  const districtsId = req.params.id;
  const { name, city_id } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!city_id) {
    return res.status(400).json({ message: "City ID is required" });
  }

  // Prepare the SQL query
  const query = `
    UPDATE districts SET name=?, city_id=? 
    WHERE id = ?;
  `;
  const values = [name, city_id, districtsId]; // Add city_id to the values

  // Execute the query
  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "District not found" });
    }
    res.status(200).json({ message: "Cập nhật quận huyện thành công" });
  });
};

exports.postDistricts = (req, res) => {
  const { name, city_id } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  if (!city_id) {
    return res.status(400).json({ message: "City ID is required" });
  }

  // Prepare the SQL query
  const query = `
    INSERT INTO districts (name, city_id) VALUES (?, ?)
  `;
  const values = [name, city_id]; // Include city_id in the values

  // Execute the query
  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Thêm quận huyện thành công!",
      districtId: results.insertId, // Return the ID of the newly created district
    });
  });
};
