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

exports.GetOneProduct = (req, res) => {};

// admin
exports.getAllProducts = (req, res) => {
  connection.query(
    `SELECT products.id, products.name, products.image, products.description, products.price, products.discountPrice, products.status, categories.name AS category
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
    discountPrice,
    description,
    image,
    status,
    category_id,
  } = req.body;

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

exports.postProduct = async (req, res, next) => {};

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
