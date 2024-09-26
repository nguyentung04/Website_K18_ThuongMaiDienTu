const connection = require("../config/database");

// Example function to get all categoris
exports.getAllcategoris = (req, res) => {
  connection.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

exports.getCategoryById = (req, res) => {
  const categoryId = req.params.id; //Sử dụng cách đặt tên camelCase nhất quán

  // Query the database to get user by ID
  connection.query(
    "SELECT * FROM categories WHERE id = ?", // SQL query
    [categoryId], // Truy vấn tham số hóa để ngăn chặn SQL injection
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

exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id; // Use consistent camelCase naming

  // Prepare the SQL query to delete the user
  const query = "DELETE FROM categories WHERE id = ?";

  // Execute the query
  connection.query(query, [categoryId], (err, results) => {
    if (err) {
      // Log the error and respond with a 500 status code
      console.error("Database query error:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the category." });
    }

    // Check if any rows were affected (i.e., if the user was deleted)
    if (results.affectedRows === 0) {
      // If no rows were affected, respond with a 404 status code
      return res.status(404).json({ message: "category not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "category deleted successfully" });
  });
};

exports.updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  // Prepare the SQL query
  const query = `
    UPDATE categories SET name=?
    WHERE id = ?;
  `;
  const values = [name, categoryId];

  // Execute the query
  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "category not found" });
    }
    res.status(200).json({ message: "category updated successfully" });
  });
};

exports.postCategory = (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  // Prepare the SQL query
  const query = `
    INSERT INTO categories (name)
    VALUES (?);
  `;
  const values = [name || ""]; // Use empty string if description is not provided

  // Execute the query
  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Category created successfully",
      categoryId: results.insertId, // Return the ID of the newly created category
    });
  });
};
