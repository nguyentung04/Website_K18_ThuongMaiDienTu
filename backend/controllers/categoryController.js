const connection = require("../config/database");

// Lấy tất cả danh mục
exports.getAllCategories = (req, res) => {
  const query = "SELECT id, name, description, logo FROM categories";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh mục:", err);
      return res.status(500).json({ error: "Không thể lấy danh mục. Vui lòng thử lại sau." });
    }
    res.status(200).json(results);
  });
};

// Lấy danh mục theo ID
exports.getCategoryById = (req, res) => {
  const categoryId = req.params.id;

  const query = "SELECT id, name, description, logo FROM categories WHERE id = ?";

  connection.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh mục:", err);
      return res.status(500).json({ error: "Không thể lấy danh mục. Vui lòng thử lại sau." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }
    res.status(200).json(results[0]);
  });
};

// Xóa danh mục theo ID
exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id;

  // Kiểm tra danh mục có chứa sản phẩm không
  const checkQuery = "SELECT COUNT(*) AS productCount FROM products WHERE category_id = ?";
  connection.query(checkQuery, [categoryId], (err, results) => {
    if (err) {
      console.error("Lỗi khi kiểm tra sản phẩm trong danh mục:", err);
      return res.status(500).json({ error: "Không thể kiểm tra danh mục. Vui lòng thử lại sau." });
    }

    const productCount = results[0].productCount;
    if (productCount > 0) {
      return res.status(400).json({ message: "Không thể xóa danh mục vì có sản phẩm liên quan." });
    }

    // Nếu không có sản phẩm, tiến hành xóa
    const deleteQuery = "DELETE FROM categories WHERE id = ?";
    connection.query(deleteQuery, [categoryId], (err, results) => {
      if (err) {
        console.error("Lỗi khi xóa danh mục:", err);
        return res.status(500).json({ error: "Không thể xóa danh mục. Vui lòng thử lại sau." });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy danh mục." });
      }
      res.status(200).json({ message: "Xóa danh mục thành công." });
    });
  });
};

// Cập nhật danh mục theo ID
exports.updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const { name, description, logo } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: "Tên và mô tả danh mục là bắt buộc." });
  }

  const query = "UPDATE categories SET name = ?, description = ?, logo = ? WHERE id = ?";
  const values = [name, description, logo || null, categoryId];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Lỗi khi cập nhật danh mục:", err);
      return res.status(500).json({ error: "Không thể cập nhật danh mục. Vui lòng thử lại sau." });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }
    res.status(200).json({ message: "Cập nhật danh mục thành công." });
  });
};

// Thêm danh mục mới
exports.postCategory = (req, res) => {
  const { name, description, logo } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Tên và mô tả danh mục là bắt buộc." });
  }

  const query = "INSERT INTO categories (name, description, logo) VALUES (?, ?, ?)";
  const values = [name, description, logo || null];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Lỗi khi thêm danh mục:", err);
      return res.status(500).json({ error: "Không thể thêm danh mục. Vui lòng thử lại sau." });
    }
    res.status(201).json({
      message: "Thêm danh mục thành công.",
      categoryId: results.insertId,
    });
  });
};

// Lấy tất cả sản phẩm của một danh mục
exports.getAllProductOfCategory = (req, res) => {
  const categoryId = req.params.id;

  const query = `
    SELECT 
      c.id AS category_id,
      c.name AS category_name,
      c.description,
      c.logo,
      p.id AS product_id,
      p.name AS product_name,
      p.price,
      p.stock,
      pd.machineType,
      pd.identification,
      pd.thickness,
      pd.wireMaterial,
      pd.antiWater,
      pd.gender,
      pd.color
    FROM 
      categories c
    LEFT JOIN 
      products p ON p.category_id = c.id
    LEFT JOIN 
      product_detail pd ON p.id = pd.product_id
    WHERE 
      c.id = ?
    LIMIT 20;
  `;

  connection.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy sản phẩm trong danh mục:", err);
      return res.status(500).json({ error: "Không thể lấy sản phẩm. Vui lòng thử lại sau." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong danh mục này." });
    }
    res.status(200).json(results);
  });
};
