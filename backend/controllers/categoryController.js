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

// Lấy tất cả sản phẩm của một danh mục
exports.getAllProductOfCategory = (req, res) => {
  const productId = req.params.id;

  connection.query(
    `SELECT 
      c.id AS category_id,
      c.name AS category_name,
      c.description,
      c.logo,
      p.*,
      pd.machineType,
      pd.identification,
      pd.thickness,
      pd.wireMaterial,
      pd.antiWater,
      pd.gender,
      pd.color,
      pd.product_id 
    FROM 
      categories c 
    LEFT JOIN 
      products p ON p.category_id = c.id
    LEFT JOIN 
      product_detail pd ON p.id = pd.product_id
    WHERE 
      c.id = ?
    LIMIT 20;`,
    [productId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "No products found in this category" });
      }
      res.status(200).json(results);
    }
  );
};
