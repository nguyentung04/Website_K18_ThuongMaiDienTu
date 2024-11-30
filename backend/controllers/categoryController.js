const connection = require("../config/database");

// Lấy tất cả danh mục
exports.getAllCategories = (req, res) => {
  connection.query("SELECT id, name, description, logo FROM categories", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Lấy danh mục theo ID
exports.getCategoryById = (req, res) => {
  const categoryId = req.params.id;

  connection.query(
    "SELECT id, name, description, logo FROM categories WHERE id = ?",
    [categoryId],
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "An error occurred while fetching the category." });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(results[0]);
    }
  );
};

// Xóa danh mục theo ID
exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id;

  const query = "DELETE FROM categories WHERE id = ?";

  connection.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "An error occurred while deleting the category." });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  });
};

// Cập nhật danh mục theo ID
exports.updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const { name, description, logo } = req.body;

  if (!name || !description || !categoryId) {
    return res.status(400).json({ error: "Name, description, and ID are required." });
  }

  const query = `
    UPDATE categories SET name=?, description=?, logo=? 
    WHERE id = ?;
  `;
  const values = [name, description, logo || null, categoryId];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Database query failed", details: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category updated successfully" });
  });
};

// Thêm danh mục mới
exports.postCategory = (req, res) => {
  const { name, description, logo } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Name and description are required" });
  }

  const query = `
    INSERT INTO categories (name, description, logo)
    VALUES (?, ?, ?);
  `;
  const values = [name, description, logo || ""];

  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      message: "Category created successfully",
      categoryId: results.insertId,
    });
  });
};



