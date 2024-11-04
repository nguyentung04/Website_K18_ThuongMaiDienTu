// const connection = require("../config/database");

// exports.getAllProducts = (req, res) => {
//   connection.query(
//     `
//       SELECT 
//         DATE_FORMAT(created_at, '%Y-%m') AS month, 
//         COUNT(*) AS totalProducts
//       FROM products
//       GROUP BY month
//       ORDER BY month DESC;
//     `,
//     (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       res.status(200).json(results);
//     }
//   );
// };

// // Sản phẩm nổi bật
// exports.featuredProducts = (req, res) => {
//   const query = `
//     SELECT 
//       p.*,
//       COUNT(pl.id) AS like_count
//     FROM 
//       products p
//     LEFT JOIN 
//       product_likes pl ON p.id = pl.product_id
//     WHERE 
//       p.status = 'nổi bật'
//     GROUP BY 
//       p.id
//     ORDER BY 
//       p.created_at DESC;
//   `;

//   connection.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json(results);
//   });
// };

// // Sản phẩm bán chạy
// exports.bestSellProducts = (req, res) => {
//   const query = `
//     SELECT 
//       p.*,
//       COUNT(pl.id) AS like_count
//     FROM 
//       products p
//     LEFT JOIN 
//       product_likes pl ON p.id = pl.product_id
//     WHERE 
//       p.status = 'bán chạy'
//     GROUP BY 
//       p.id
//     ORDER BY 
//       p.created_at DESC;
//   `;

//   connection.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json(results);
//   });
// };

// // Sản phẩm khuyến mãi
// exports.sellProducts = (req, res) => {
//   const query = `
//     SELECT 
//       p.*,
//       COUNT(pl.id) AS like_count
//     FROM 
//       products p
//     LEFT JOIN 
//       product_likes pl ON p.id = pl.product_id
//     WHERE 
//       p.status = 'khuyến mãi'
//     GROUP BY 
//       p.id
//     ORDER BY 
//       p.created_at DESC;
//   `;

//   connection.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json(results);
//   });
// };

// // Lấy một sản phẩm theo ID
// exports.GetOneProduct = (req, res) => {
//   const productId = req.params.id;
//   connection.query(
//     `
//       SELECT * 
//       FROM products 
//       WHERE id = ?;
//     `,
//     [productId],
//     (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       if (results.length === 0) {
//         return res.status(404).json({ message: "Sản phẩm không tồn tại" });
//       }
//       res.status(200).json(results[0]);
//     }
//   );
// };

// // Lấy tất cả sản phẩm cho admin
// exports.getAllProductsAdmin = (req, res) => {
//   const query = `
//     SELECT 
//       products.id,
//       products.name,
//       product_images.image_url,
//       products.description,
//       products.price,
//       products.stock,
//       categories.name AS category,
//       GROUP_CONCAT(DISTINCT product_images.image_url) AS images,
//        COUNT(DISTINCT product_likes.id) AS likes
//     FROM products
//     INNER JOIN categories ON products.category_id = categories.id
//     LEFT JOIN product_images ON products.id = product_images.product_id
//     GROUP BY products.id;
//   `;

//   connection.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json(results);
//   });
// };

// // Lấy sản phẩm theo ID cho admin
// exports.getProductById = (req, res) => {
//   const productId = req.params.id;
//   const query = `
//     SELECT 
//       products.id,
//       products.name,
//       product_images.image_url,
//       products.description,
//       products.price,
//       products.stock,
//       categories.name AS category,
//       GROUP_CONCAT(DISTINCT product_images.image_url) AS images,
//       COUNT(DISTINCT product_likes.id) AS likes
//     FROM products
//     INNER JOIN categories ON products.category_id = categories.id
//     LEFT JOIN product_images ON products.id = product_images.product_id
//     WHERE products.id = ?
//     GROUP BY products.id;
//   `;

//   connection.query(query, [productId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ message: "Sản phẩm không tồn tại" });
//     }
//     res.status(200).json(results[0]);
//   });
// };


// // Cập nhật sản phẩm
// exports.updateProduct = (req, res) => {
//   const productId = req.params.id;
//   const { name, price, description, image_url, category_id, stock, images } = req.body;

//   const query = `
//     UPDATE products 
//     SET 
//       name = ?, 
//       image_url = ?, 
//       price = ?,  
//       description = ?,  
//       category_id = ?, 
//       stock = ?
//     WHERE 
//       id = ?;
//   `;
//   const values = [name, image_url, price, description, category_id, stock, productId];

//   connection.beginTransaction((err) => {
//     if (err) return res.status(500).json({ error: err.message });

//     connection.query(query, values, (err, results) => {
//       if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
      
//       if (results.affectedRows === 0) {
//         return connection.rollback(() => res.status(404).json({ message: "Sản phẩm không tồn tại" }));
//       }

//       if (images && images.length > 0) {
//         const deleteImagesQuery = "DELETE FROM product_images WHERE product_id = ?";
//         connection.query(deleteImagesQuery, [productId], (err) => {
//           if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

//           const insertImagesQuery = "INSERT INTO product_images (product_id, image_url) VALUES ?";
//           const imagesData = images.map((image) => [productId, image]);

//           connection.query(insertImagesQuery, [imagesData], (err) => {
//             if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

//             connection.commit((err) => {
//               if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
//               res.status(200).json({ message: "Sản phẩm được cập nhật thành công" });
//             });
//           });
//         });
//       } else {
//         connection.commit((err) => {
//           if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
//           res.status(200).json({ message: "Sản phẩm được cập nhật thành công" });
//         });
//       }
//     });
//   });
// };


// // Thêm sản phẩm
// exports.postProduct = (req, res, next) => {
//   try {
//     const { name, price, image_url, description, category_id, stock, images } = req.body;
//     const query = `
//       INSERT INTO products (name, image_url, price, description, category_id, stock) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?);
//     `;
//     const values = [name, image_url, price, description, category_id, stock];

//     connection.beginTransaction((err) => {
//       if (err) return res.status(500).json({ error: err.message });

//       connection.query(query, values, (err, results) => {
//         if (err) return connection.rollback(() => res.status(500).json({ error: "Đã xảy ra lỗi khi thêm sản phẩm." }));

//         const productId = results.insertId;

//         if (images && images.length > 0) {
//           const insertImagesQuery = "INSERT INTO product_images (product_id, image_url) VALUES ?";
//           const imagesData = images.map((image) => [productId, image]);

//           connection.query(insertImagesQuery, [imagesData], (err) => {
//             if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

//             connection.commit((err) => {
//               if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
//               res.status(201).json({ message: "Sản phẩm đã được thêm thành công", productId });
//             });
//           });
//         } else {
//           connection.commit((err) => {
//             if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
//             res.status(201).json({ message: "Sản phẩm đã được thêm thành công", productId });
//           });
//         }
//       });
//     });
//   } catch (error) {
//     next(error);
//   }
// };



// // Xóa sản phẩm
// exports.deleteProduct = (req, res) => {
//   const { productId } = req.params;

//   connection.beginTransaction((err) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const deleteImagesQuery = "DELETE FROM product_images WHERE product_id = ?";
//     connection.query(deleteImagesQuery, [productId], (err) => {
//       if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

//       const deleteLikesQuery = "DELETE FROM product_likes WHERE product_id = ?";
//       connection.query(deleteLikesQuery, [productId], (err) => {
//         if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

//         const deleteProductQuery = "DELETE FROM products WHERE id = ?";
//         connection.query(deleteProductQuery, [productId], (err) => {
//           if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

//           connection.commit((err) => {
//             if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
//             res.status(200).json({ message: "Sản phẩm đã được xóa thành công" });
//           });
//         });
//       });
//     });
//   });
// };


// // Lấy số lượt thích của sản phẩm
// exports.getAllProductLikes = (req, res) => {
//   const query = `
//     SELECT 
//       p.id AS product_id, 
//       p.name AS product_name, 
//       COUNT(pl.id) AS like_count
//     FROM 
//       products p
//     LEFT JOIN 
//       product_likes pl ON p.id = pl.product_id
//     GROUP BY 
//       p.id, p.name
//     ORDER BY 
//       like_count DESC;
//   `;

//   connection.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Lỗi khi lấy số lượt thích sản phẩm." });
//     }

//     res.status(200).json(results);
//   });
// };

// // Toggle thích sản phẩm
// exports.toggleProductLike = (req, res) => {
//   const productId = req.params.id;
//   const userId = req.body.userId;

//   if (!userId || !productId) {
//     return res.status(400).json({ error: "ID người dùng và sản phẩm là bắt buộc." });
//   }

//   const checkLikeQuery = "SELECT * FROM product_likes WHERE product_id = ? AND user_id = ?";

//   connection.query(checkLikeQuery, [productId, userId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Lỗi khi kiểm tra trạng thái thích." });
//     }

//     if (results.length > 0) {
//       const unlikeQuery = "DELETE FROM product_likes WHERE product_id = ? AND user_id = ?";
//       connection.query(unlikeQuery, [productId, userId], (err) => {
//         if (err) {
//           return res.status(500).json({ error: "Lỗi khi bỏ thích sản phẩm." });
//         }
//         res.status(200).json({ message: "Đã bỏ thích sản phẩm thành công." });
//       });
//     } else {
//       const likeQuery = "INSERT INTO product_likes (product_id, user_id) VALUES (?, ?)";
//       connection.query(likeQuery, [productId, userId], (err) => {
//         if (err) {
//           return res.status(500).json({ error: "Lỗi khi thích sản phẩm." });
//         }
//         res.status(200).json({ message: "Đã thích sản phẩm thành công." });
//       });
//     }
//   });
// };
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
    INSERT INTO products (name, description, price, stock, category_id, created_at)
    VALUES (?, ?, ?, ?, ?, NOW());
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
      const imageQuery = `INSERT INTO product_images (product_id, image_url) VALUES ?`;

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