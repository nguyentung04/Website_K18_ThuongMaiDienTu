
const connection = require("../config/database");

// Lấy tất cả sản phẩm với tổng số sản phẩm theo từng tháng
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
    FROM products p
    LEFT JOIN product_likes pl ON p.id = pl.product_id
    WHERE p.status = 'nổi bật'
    GROUP BY p.id
    ORDER BY p.created_at DESC;
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
    FROM products p
    LEFT JOIN product_likes pl ON p.id = pl.product_id
    WHERE p.status = 'bán chạy'
    GROUP BY p.id
    ORDER BY p.created_at DESC;
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
    FROM products p
    LEFT JOIN product_likes pl ON p.id = pl.product_id
    WHERE p.status = 'khuyến mãi'
    GROUP BY p.id
    ORDER BY p.created_at DESC;
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
      SELECT 
        p.*, 
        c.name AS category_name, 
        c.description AS category_description, 
        GROUP_CONCAT(pi.image_url) AS images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = ?
      GROUP BY p.id;
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
  const query = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      c.name AS category,
      GROUP_CONCAT(DISTINCT pi.image_url) AS images,
      COUNT(DISTINCT pl.id) AS likes
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN product_likes pl ON p.id = pl.product_id
    GROUP BY p.id;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
 

};

// Lấy sản phẩm theo ID cho admin
exports.getProductById = (req, res) => {
  const productId = req.params.id;
  const query = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock,
      c.name AS category,
      GROUP_CONCAT(DISTINCT pi.image_url) AS images,
      COUNT(DISTINCT pl.id) AS likes
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    LEFT JOIN product_likes pl ON p.id = pl.product_id
    WHERE p.id = ?
    GROUP BY p.id;
  `;

  connection.query(query, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json(results[0]);
  });
};

// Thêm sản phẩm mới
exports.addProduct = (req, res) => {
  const { name, description, price, stock, category_id, images } = req.body; // Lấy images từ body

  // Thêm sản phẩm vào bảng products
  const query = `
    INSERT INTO products (name, description, price, stock, category_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW());
  `;
  const productData = [name, description, price, stock, category_id];

  connection.query(query, productData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const productId = result.insertId;

    // Thêm hình ảnh cho sản phẩm nếu có
    if (images && images.length > 0) {
      const imageValues = images.map((image_url) => [productId, image_url]);
      const imageQuery = `INSERT INTO product_images (product_id, image_url,is_primary) VALUES ?`; // Use VALUES ? for bulk insert

      connection.query(imageQuery, [imageValues], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Sản phẩm đã được thêm thành công", productId });
      });
    } else {
      res.status(201).json({ message: "Sản phẩm đã được thêm thành công", productId });
    }
  });
};


// Cập nhật sản phẩm
exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const { name, description, price, stock, category_id, images } = req.body; // Lấy images từ body

  // Cập nhật thông tin sản phẩm
  const query = `
    UPDATE products 
    SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, updated_at = NOW() 
    WHERE id = ?;
  `;
  const productData = [name, description, price, stock, category_id, productId];

  connection.query(query, productData, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Cập nhật hình ảnh nếu có
    if (images && images.length > 0) {
      // Xóa các ảnh cũ
      const deleteImagesQuery = `DELETE FROM product_images WHERE product_id = ?`;
      connection.query(deleteImagesQuery, [productId], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Thêm các ảnh mới
        const imageValues = images.map((image_url) => [productId, image_url]);
        const imageQuery = `INSERT INTO product_images (product_id, image_url) VALUES ?`;

        connection.query(imageQuery, [imageValues], (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(200).json({ message: "Sản phẩm đã được cập nhật thành công" });
        });
      });
    } else {
      res.status(200).json({ message: "Sản phẩm đã được cập nhật thành công" });
    }
  });
};

// Xóa sản phẩm
exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  // Xóa sản phẩm và các hình ảnh liên quan
  const deleteImagesQuery = `DELETE FROM product_images WHERE product_id = ?`;
  const deleteProductQuery = `DELETE FROM products WHERE id = ?`;

  connection.query(deleteImagesQuery, [productId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    connection.query(deleteProductQuery, [productId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: "Sản phẩm đã được xóa thành công" });
    });
  });
};