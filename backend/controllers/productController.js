const connection = require("../config/database");

exports.getAllProducts = (req, res) => {
  connection.query(
    `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS month, 
        COUNT(*) AS totalProducts
      FROM products
      GROUP BY month
      ORDER BY month DESC;`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};
//sanpham noi bat
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
      p.created_at DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

//sanpham bán chạy
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
    p.created_at DESC
`;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};
//sản phẩm khuyến mãi
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
      p.created_at DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
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
    [productId], // Truyền giá trị ID vào câu lệnh SQL
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
      res.status(200).json(results[0]); // Trả về sản phẩm đầu tiên
    }
  );
};

// admin
exports.getAllProducts = (req, res) => {
  connection.query(
    `SELECT products.id,products.name,products.image,products.description,products.status,products.price, products.discountPrice, categories.name AS category
FROM products
INNER JOIN categories ON products.category_id = categories.id
WHERE 1;
`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
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
  const {
    name,
    price,
    sell_price,
    description,
    discountPrice,
    image,
    status,
    category_id,
  } = req.body;

  // Log the incoming data for debugging
  console.log("Updating product with ID:", productId);
  console.log("Product Data:", {
    name,
    price,
    discountPrice,
    description,
    image,
    status,
    category_id,
  });

  const query = `
    UPDATE products 
    SET 
      name = ?, 
      image = ?, 
      price = ?,  
      discountPrice = ?,
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
    discountPrice,
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
      // quantity,
      discountPrice,
      image,
      description,
      status,
      category_id,
    } = req.body;

    // Ensure category_id is an integer
    const categoryId = parseInt(category_id, 10);

    const query = `
      INSERT INTO products (name, image, price, discountPrice, description, status, category_id) 
      VALUES (?, ?, ?, ?,?, ?, ?)
    `;
    const values = [
      name,
      image,
      price,
      // quantity,
      discountPrice,
      description,
      status,
      categoryId,
    ];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while adding the product." });
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
  // const productId = req.params.id;

  const { productId } = req.params;

  // Bắt đầu transaction
  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Xóa chi tiết đơn hàng trước
    connection.query(
      "DELETE FROM product_detail WHERE product_id = ?",
      [productId],
      (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        // Xóa đơn hàng
        connection.query("DELETE FROM products WHERE id = ?", [productId], (err) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }

          // Cam kết transaction
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }
            res.status(200).json({ message: "Order deleted successfully" });
          });
        });
      }
    );
  });
};

//lấy số lượt like sản phẩm
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
  like_count DESC

  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching product likes:", err.message);
      return res.status(500).json({ error: "Error fetching product likes." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No product likes found." });
    }

    res.status(200).json(results);
  });
};

const updateLikeCount = (productId, res) => {
  const countQuery =
    "SELECT COUNT(*) AS likeCount FROM product_likes WHERE product_id = ?";

  connection.query(countQuery, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi cập nhật số lượt thích." });
    }

    const likeCount = results[0].likeCount;

    // Cập nhật số lượt thích vào bảng products
    const updateQuery = "UPDATE products SET like_count = ? WHERE id = ?";
    connection.query(updateQuery, [likeCount, productId], (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi cập nhật số lượt thích sản phẩm." });
      }

      // Trả về kết quả thành công
      res.status(200).json({ message: "Cập nhật thành công.", likeCount });
    });
  });
};

//thực hiện thích
exports.toggleProductLike = (req, res) => {
  const productId = req.params.id;
  const userId = req.body.userId;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "Cần xác thực người dùng để thích/bỏ thích sản phẩm." });
  }

  if (!productId) {
    return res.status(400).json({ error: "ID sản phẩm là bắt buộc." });
  }

  const checkLikeQuery =
    "SELECT * FROM product_likes WHERE product_id = ? AND user_id = ?";

  connection.query(checkLikeQuery, [productId, userId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Lỗi khi kiểm tra trạng thái thích." });
    }

    if (results.length > 0) {
      const unlikeQuery =
        "DELETE FROM product_likes WHERE product_id = ? AND user_id = ?";
      connection.query(unlikeQuery, [productId, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: "Lỗi khi bỏ thích sản phẩm." });
        }
        updateLikeCount(productId, res);
      });
    } else {
      const likeQuery =
        "INSERT INTO product_likes (product_id, user_id) VALUES (?, ?)";
      connection.query(likeQuery, [productId, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: "Lỗi khi thích sản phẩm." });
        }
        updateLikeCount(productId, res);
      });
    }
  });
};

exports.ProductDetail = (req, res) => {
  // Lấy giá trị ID từ URL params
  const productId = req.params.id;
  // Thực hiện truy vấn SQL với giá trị ID
  connection.query(
    `SELECT 
    c.id AS category_id,
    c.name AS category_name,
    c.logo,
    p.*,
    pd.machineType,
    pd.identification,
    pd.thickness,
    pd.wireMaterial,
    pd.antiWater,
    pd.gender,
    pd.coler
FROM 
    products p
LEFT JOIN 
    categories c ON p.category_id = c.id
LEFT JOIN 
    product_detail pd ON p.id = pd.product_id
WHERE p.id = ?;`,
    [productId], // Truyền giá trị ID vào câu lệnh SQL
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
      res.status(200).json(results[0]); // Trả về sản phẩm đầu tiên
    }
  );
};
