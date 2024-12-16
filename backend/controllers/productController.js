const connection = require("../config/database");

// Lấy tất cả sản phẩm từ database
exports.getAllProducts = (req, res) => {
  const query = `
    SELECT * FROM products ORDER BY created_at DESC;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results); // Trả về tất cả sản phẩm
  });
};

// Lấy sản phẩm theo giới tính
exports.getProductsByGender = (req, res) => {
  const gender = req.params.gender; // Giá trị gender từ frontend, có thể là 'Nam' hoặc 'Nữ'
  const query = `
    SELECT 
      p.*, 
      c.name AS category_name, 
      c.description AS category_description, 
      IFNULL(GROUP_CONCAT(pi.image_url), '') AS images  -- Đảm bảo images không NULL
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.gender = ? 
    GROUP BY p.id
    ORDER BY p.created_at DESC;
  `;

  connection.query(query, [gender], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(200).json([]); // Trả về mảng rỗng nếu không có sản phẩm
    }
    res.status(200).json(results); // Trả về mảng sản phẩm
  });
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
      p.short_description,
      p.description,
      p.price,
      p.stock,
      p.gender,
      p.diameter,
      p.wire_material,
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
      p.short_description,
      p.description,
      p.price,
      p.stock,
      p.gender,
      p.diameter,
      p.wire_material,
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
  const { name, short_description, description, price, stock, category_id, gender, diameter, wire_material, images } = req.body; // Lấy images từ body

  // Thêm sản phẩm vào bảng products
  const query = `
  INSERT INTO products (name, short_description, description, price, stock, category_id, gender,diameter,wire_material, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
  `;
  const productData = [name, short_description, description, price, stock, category_id, gender, diameter, wire_material];

  connection.query(query, productData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const productId = result.insertId;

    // Thêm hình ảnh cho sản phẩm nếu có
    if (images && images.length > 0) {
      const imageValues = images.map((image_url) => [productId, image_url]);
      const imageQuery = `INSERT INTO product_images (product_id, image_url) VALUES ?`; // Use VALUES ? for bulk insert

      connection.query(imageQuery, [imageValues], (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res
          .status(201)
          .json({ message: "Sản phẩm đã được thêm thành công", productId });
      });
    } else {
      res
        .status(201)
        .json({ message: "Sản phẩm đã được thêm thành công", productId });
    }
  });
};

// Cập nhật sản phẩm
exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const { name, short_description, description, price, stock, category_id, gender, diameter, wire_material, images } = req.body;

  // Transaction để đảm bảo tính toàn vẹn
  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
  
    // Update product_images
    connection.query(
      "UPDATE product_images SET product_id = ?, image_url = ? WHERE product_id = ?;", 
      [productId, images, productId], // Assuming `productId` and `imageUrl` are passed in the request body
      (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }
  
        // Update products
        connection.query(
          `UPDATE products 
          SET name = ?, short_description = ?, description = ?, price = ?, stock = ?, category_id = ?, gender = ?, diameter = ?, wire_material = ?, updated_at = NOW() 
          WHERE id = ?;`,
          [name,short_description, description, price, stock, category_id, gender, diameter, wire_material, productId], // Assuming these variables are passed in the request body
          (err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }
  
            // Commit the transaction
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }
              res.status(200).json({ message: "Product updated successfully" });
            });
          }
        );
      }
    );
  });
  
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  // Transaction đảm bảo xóa dữ liệu liên quan
  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Xóa hình ảnh liên quan
    connection.query(
      "DELETE FROM product_images WHERE product_id = ?",
      [productId],
      (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        // Xóa sản phẩm
        connection.query(
          "DELETE FROM products WHERE id = ?",
          [productId],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }

            // Commit transaction
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }
              res.status(200).json({ message: "Sản phẩm đã được xóa thành công" });
            });
          }
        );
      }
    );
  });
};

// Lấy sản phẩm theo loại
exports.getProductsByCategory = (req, res) => {
  const categoryId = req.params.categoryId; // ID của loại sản phẩm
  const gender = req.query.gender; // Lấy giới tính từ query (nếu có)

  // Câu truy vấn SQL
  let query = `
    SELECT 
      p.*, 
      c.name AS category_name, 
      GROUP_CONCAT(pi.image_url) AS images
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.category_id = ?`;

  // Nếu có giới tính, thêm điều kiện vào câu truy vấn
  if (gender) {
    query += ` AND p.gender = ?`;
  }

  query += ` GROUP BY p.id;`;

  const params = [categoryId];  // Mảng chứa categoryId
  if (gender) {
    params.push(gender);  // Nếu có giới tính thì thêm vào mảng params
  }

  // Thực hiện câu truy vấn
  connection.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không có sản phẩm nào thuộc loại này" });
    }
    res.status(200).json(results); // Trả về kết quả
  });
};


