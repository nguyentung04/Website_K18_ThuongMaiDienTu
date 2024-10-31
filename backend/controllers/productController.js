const connection = require("../config/database");

exports.getAllProducts = (req, res) => {
  connection.query(
    `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS month, 
        COUNT(*) AS totalProducts
      FROM products
      GROUP BY month
      ORDER BY month DESC;
    `,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};

// Sản phẩm nổi bật
exports.featuredProducts = (req, res) => {
  const query = `
    SELECT 
      p.*,
      COUNT(pl.id) AS like_count
    FROM 
      products p
    LEFT JOIN 
      product_likes pl ON p.id = pl.product_id
    WHERE 
      p.status = 'nổi bật'
    GROUP BY 
      p.id
    ORDER BY 
      p.created_at DESC;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Sản phẩm bán chạy
exports.bestSellProducts = (req, res) => {
  const query = `
    SELECT 
      p.*,
      COUNT(pl.id) AS like_count
    FROM 
      products p
    LEFT JOIN 
      product_likes pl ON p.id = pl.product_id
    WHERE 
      p.status = 'bán chạy'
    GROUP BY 
      p.id
    ORDER BY 
      p.created_at DESC;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Sản phẩm khuyến mãi
exports.sellProducts = (req, res) => {
  const query = `
    SELECT 
      p.*,
      COUNT(pl.id) AS like_count
    FROM 
      products p
    LEFT JOIN 
      product_likes pl ON p.id = pl.product_id
    WHERE 
      p.status = 'khuyến mãi'
    GROUP BY 
      p.id
    ORDER BY 
      p.created_at DESC;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Lấy một sản phẩm theo ID
exports.GetOneProduct = (req, res) => {
  const productId = req.params.id;
  connection.query(
    `
      SELECT * 
      FROM products 
      WHERE id = ?;
    `,
    [productId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
      res.status(200).json(results[0]);
    }
  );
};

// Lấy tất cả sản phẩm cho admin
exports.getAllProductsAdmin = (req, res) => {
  connection.query(
    `
      SELECT 
        products.id,
        products.name,
        products.image_url,
        products.description,
        products.status,
        products.price,
        products.discountPrice,
        products.stock,
        categories.name AS category
      FROM products
      INNER JOIN categories ON products.category_id = categories.id;
    `,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};

// Lấy sản phẩm theo ID cho admin
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
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
      res.status(200).json(results[0]);
    }
  );
};

// Cập nhật sản phẩm
exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const { name, price, description, discountPrice, image_url, status, category_id, stock } = req.body;

  const query = `
    UPDATE products 
    SET 
      name = ?, 
      image_url = ?, 
      price = ?,  
      discountPrice = ?, 
      description = ?, 
      status = ?, 
      category_id = ?, 
      stock = ?
    WHERE 
      id = ?;
  `;
  const values = [name, image_url, price, discountPrice, description, status, category_id, stock, productId];

  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json({ message: "Sản phẩm được cập nhật thành công" });
  });
};

// Thêm sản phẩm
exports.postProduct = (req, res, next) => {
  try {
    const { name, price, discountPrice, image_url, description, status, category_id, stock } = req.body;
    const query = `
      INSERT INTO products (name, image_url, price, discountPrice, description, status, category_id, stock) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [name, image_url, price, discountPrice, description, status, category_id, stock];

    connection.query(query, values, (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Đã xảy ra lỗi khi thêm sản phẩm." });
      }
      res.status(201).json({ message: "Sản phẩm đã được thêm thành công", productId: results.insertId });
    });
  } catch (error) {
    next(error);
  }
};

// Xóa sản phẩm
exports.deleteProduct = (req, res) => {
  const { productId } = req.params;

  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    connection.query(
      "DELETE FROM product_detail WHERE product_id = ?",
      [productId],
      (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        connection.query("DELETE FROM products WHERE id = ?", [productId], (err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }
            res.status(200).json({ message: "Sản phẩm đã được xóa thành công" });
          });
        });
      }
    );
  });
};

// Lấy số lượt thích của sản phẩm
exports.getAllProductLikes = (req, res) => {
  const query = `
    SELECT 
      p.id AS product_id, 
      p.name AS product_name, 
      COUNT(pl.id) AS like_count
    FROM 
      products p
    LEFT JOIN 
      product_likes pl ON p.id = pl.product_id
    GROUP BY 
      p.id, p.name
    ORDER BY 
      like_count DESC;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi lấy số lượt thích sản phẩm." });
    }

    res.status(200).json(results);
  });
};

// Toggle thích sản phẩm
exports.toggleProductLike = (req, res) => {
  const productId = req.params.id;
  const userId = req.body.userId;

  if (!userId || !productId) {
    return res.status(400).json({ error: "ID người dùng và sản phẩm là bắt buộc." });
  }

  const checkLikeQuery = "SELECT * FROM product_likes WHERE product_id = ? AND user_id = ?";

  connection.query(checkLikeQuery, [productId, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi kiểm tra trạng thái thích." });
    }

    if (results.length > 0) {
      const unlikeQuery = "DELETE FROM product_likes WHERE product_id = ? AND user_id = ?";
      connection.query(unlikeQuery, [productId, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: "Lỗi khi bỏ thích sản phẩm." });
        }
        res.status(200).json({ message: "Đã bỏ thích sản phẩm thành công." });
      });
    } else {
      const likeQuery = "INSERT INTO product_likes (product_id, user_id) VALUES (?, ?)";
      connection.query(likeQuery, [productId, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: "Lỗi khi thích sản phẩm." });
        }
        res.status(200).json({ message: "Đã thích sản phẩm thành công." });
      });
    }
  });
};
