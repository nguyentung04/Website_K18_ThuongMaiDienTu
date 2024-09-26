const connection = require('../config/database');

exports.getAllProducts = (req, res) => {
  connection.query("SELECT * FROM products", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};
//sanpham noi bat
exports.featuredProducts = (req, res) => {
  connection.query(
    `SELECT *
  FROM products
  WHERE status = 'nổi bật'
  ORDER BY created_at DESC

;`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};

//sanpham bán chạy
exports.bestSellProducts = (req, res) => {
  connection.query(
    `SELECT *
  FROM products
  WHERE status = 'bán chạy'
  ORDER BY created_at DESC

;`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};
//sản phẩm khuyến mãi
exports.sellProducts = (req, res) => {
  connection.query(
    `SELECT *
  FROM products
  WHERE status = 'khuyến mãi'
  ORDER BY created_at DESC

;`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};

exports.GetOneProduct = (req, res) => {
  // Lấy giá trị ID từ URL params
  const productId = req.params.id;
  // Thực hiện truy vấn SQL với giá trị ID
  connection.query(
   `SELECT 
    *
FROM 
    products
WHERE 
    id = ?;`,
    [productId],  // Truyền giá trị ID vào câu lệnh SQL
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      }
      res.status(200).json(results[0]); // Trả về sản phẩm đầu tiên
    }
  );
};



// admin
exports.getAllProducts = (req, res) => {
  connection.query(`SELECT products.id,products.name,products.image,products.description,products.status,products.price, categories.name AS category
FROM products
INNER JOIN categories ON products.category_id = categories.id
WHERE 1;
`, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

exports.getProductById = (req, res) => {
  const productId = req.params.id;
  connection.query(
    "SELECT * FROM products WHERE id = ?",
    [productId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(results[0]);
    }
  );
};

exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const { name, price, sell_price, description, image, status, category_id } =
    req.body;

  // Log the incoming data for debugging
  console.log("Updating product with ID:", productId);
  console.log("Product Data:", { name, price, description, image, status, category_id });

  const query = `
    UPDATE products 
    SET 
      name = ?, 
      image = ?, 
      price = ?,  
      description = ?, 
      status = ?, 
      category_id = ? 
    WHERE 
      id = ?;
  `;
  const values = [
    name,
    image,
    price,
    description,
    status,
    category_id,
    productId,
  ];

  // Log the SQL query and values
  console.log("SQL Query:", query);
  console.log("Values:", values);

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully" });
  });
};
exports.postProduct = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);

    const {
      name,
      price,
      image,
      description,
      status,
      category_id
    } = req.body;

    // Ensure category_id is an integer
    const categoryId = parseInt(category_id, 10);

    const query = `
      INSERT INTO products (name, image, price, description, status, category_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      name,
      image,
      price,
      description,
      status,
      categoryId
    ];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: 'An error occurred while adding the product.' });
      }
      res.status(201).json({
        message: "Product added successfully",
        productId: results.insertId,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    next(error);
  }
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  // Prepare the SQL query to delete the product
  const query = "DELETE FROM products WHERE id = ?";

  // Execute the query
  connection.query(query, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
// Check if any rows were affected (i.e., if the product was deleted)
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Product deleted successfully" });
  });
};
