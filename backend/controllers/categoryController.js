// const connection = require("../config/database");

// // Example function to get all categoris
// exports.getAllcategoris = (req, res) => {
//   connection.query("SELECT * FROM categories", (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json(results);
//   });
// };

// exports.getCategoryById = (req, res) => {
//   const categoryId = req.params.id; //Sử dụng cách đặt tên camelCase nhất quán

//   // Query the database to get user by ID
//   connection.query(
//     "SELECT * FROM categories WHERE id = ?", // SQL query
//     [categoryId], // Truy vấn tham số hóa để ngăn chặn SQL injection
//     (err, results) => {
//       if (err) {
//         // Ghi lại lỗi và phản hồi bằng mã trạng thái 500
//         console.error("Database query error:", err);
//         return res
//           .status(500)
//           .json({ error: "An error occurred while fetching the user." });
//       }

//       if (results.length === 0) {
//         // Nếu không tìm thấy người dùng, hãy trả lời bằng mã trạng thái 404
//         return res.status(404).json({ message: "User not found" });
//       }

//       // Respond with the user data
//       res.status(200).json(results[0]);
//     }
//   );
// };

// exports.deleteCategory = (req, res) => {
//   const categoryId = req.params.id; // Use consistent camelCase naming

//   // Prepare the SQL query to delete the user
//   const query = "DELETE FROM categories WHERE id = ?";

//   // Execute the query
//   connection.query(query, [categoryId], (err, results) => {
//     if (err) {
//       // Log the error and respond with a 500 status code
//       console.error("Database query error:", err);
//       return res
//         .status(500)
//         .json({ error: "An error occurred while deleting the category." });
//     }

//     // Check if any rows were affected (i.e., if the user was deleted)
//     if (results.affectedRows === 0) {
//       // If no rows were affected, respond with a 404 status code
//       return res.status(404).json({ message: "category not found" });
//     }

//     // Respond with a success message
//     res.status(200).json({ message: "category deleted successfully" });
//   });
// };

// exports.updateCategory = (req, res) => {
//   const categoryId = req.params.id;
//   const { name, logo } = req.body; // Nhận dữ liệu từ body

//   // Log dữ liệu nhận được để kiểm tra
//   console.log("Received data:", req.body);

//   // Kiểm tra nếu không có tên hoặc ID danh mục
//   if (!name || !categoryId) {
//     return res.status(400).json({ error: "Tên danh mục và ID là bắt buộc." });
//   }

//   // Nếu không có logo, gán giá trị null
//   const logoValue = logo || null;

//   // Chuẩn bị câu truy vấn SQL
//   const query = `
//     UPDATE categories SET name=?, logo=? 
//     WHERE id = ?;
//   `;
//   const values = [name, logoValue, categoryId];

//   // Thực hiện câu truy vấn
//   connection.query(query, values, (err, results) => {
//     if (err) {
//       console.error("Database query error:", err); // Log lỗi ra console
//       return res.status(500).json({ error: "Database query failed", details: err.message });
//     }
//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: "Category not found" });
//     }
//     res.status(200).json({ message: "Category updated successfully" });
//   });
// };



// exports.postCategory = (req, res) => {
//   const { name, logo } = req.body; // Thêm trường logo

//   // Validate input
//   if (!name) {
//     return res.status(400).json({ message: "Name is required" });
//   }

//   // Prepare the SQL query
//   const query = `
//     INSERT INTO categories (name, logo)
//     VALUES (?, ?);
//   `;
//   const values = [name || "", logo || ""]; // Sử dụng chuỗi rỗng nếu không có logo

//   // Execute the query
//   connection.query(query, values, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.status(201).json({
//       message: "Category created successfully",
//       categoryId: results.insertId, // Return the ID of the newly created category
//     });
//   });
// };

// exports.GetAllProductOfCategories = (req, res) => {
//   // Lấy giá trị ID từ URL params
//   const productId = req.params.id;
//   // Thực hiện truy vấn SQL với giá trị ID
//   connection.query(
//     `SELECT 
//     c.id AS category_id,
//     c.name AS category_name,
//     c.logo,
//     p.*,
//     pd.machineType,
//      pd.identification,
//       pd.thickness,
//        pd.wireMaterial,
//         pd.antiWater,
//          pd.gender,
//           pd.coler,
//            pd.product_id 
           
// FROM 
//     categories c 
// LEFT JOIN 
//     products p ON p.category_id = c.id
// LEFT JOIN 
//     product_detail pd ON p.id = pd.product_id
// WHERE 
//     c.id = ?
// LIMIT 20;
// `,
//     [productId], // Truyền giá trị ID vào câu lệnh SQL
//     (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       if (results.length === 0) {
//         return res.status(404).json({ message: "Sản phẩm không tồn tại" });
//       }
//       res.status(200).json(results); // Trả về tất cả sản phẩm

//     }
//   );
// };



const connection = require("../config/database");

// Example function to get all categoris
exports.getAllcategoris = (req, res) => {
  connection.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

exports.getCategoryById = (req, res) => {
  const categoryId = req.params.id; //Sử dụng cách đặt tên camelCase nhất quán

  // Query the database to get user by ID
  connection.query(
    "SELECT * FROM categories WHERE id = ?", // SQL query
    [categoryId], // Truy vấn tham số hóa để ngăn chặn SQL injection
    (err, results) => {
      if (err) {
        // Ghi lại lỗi và phản hồi bằng mã trạng thái 500
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching the user." });
      }

      if (results.length === 0) {
        // Nếu không tìm thấy người dùng, hãy trả lời bằng mã trạng thái 404
        return res.status(404).json({ message: "User not found" });
      }

      // Respond with the user data
      res.status(200).json(results[0]);
    }
  );
};

exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id; // Use consistent camelCase naming

  // Prepare the SQL query to delete the user
  const query = "DELETE FROM categories WHERE id = ?";

  // Execute the query
  connection.query(query, [categoryId], (err, results) => {
    if (err) {
      // Log the error and respond with a 500 status code
      console.error("Database query error:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the category." });
    }

    // Check if any rows were affected (i.e., if the user was deleted)
    if (results.affectedRows === 0) {
      // If no rows were affected, respond with a 404 status code
      return res.status(404).json({ message: "category not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "category deleted successfully" });
  });
};

exports.updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const { name, logo } = req.body; // Nhận dữ liệu từ body

  // Log dữ liệu nhận được để kiểm tra
  console.log("Received data:", req.body);

  // Kiểm tra nếu không có tên hoặc ID danh mục
  if (!name || !categoryId) {
    return res.status(400).json({ error: "Tên danh mục và ID là bắt buộc." });
  }

  // Nếu không có logo, gán giá trị null
  const logoValue = logo || null;

  // Chuẩn bị câu truy vấn SQL
  const query = `
    UPDATE categories SET name=?, logo=? 
    WHERE id = ?;
  `;
  const values = [name, logoValue, categoryId];

  // Thực hiện câu truy vấn
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error("Database query error:", err); // Log lỗi ra console
      return res.status(500).json({ error: "Database query failed", details: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category updated successfully" });
  });
};



exports.postCategory = (req, res) => {
  const { name, logo } = req.body; // Thêm trường logo

  // Validate input
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  // Prepare the SQL query
  const query = `
    INSERT INTO categories (name, logo)
    VALUES (?, ?);
  `;
  const values = [name || "", logo || ""]; // Sử dụng chuỗi rỗng nếu không có logo

  // Execute the query
  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Category created successfully",
      categoryId: results.insertId, // Return the ID of the newly created category
    });
  });
};

exports.GetAllProductOfCategories = (req, res) => {
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
          pd.coler,
           pd.product_id 
           
FROM 
    categories c 
LEFT JOIN 
    products p ON p.category_id = c.id
LEFT JOIN 
    product_detail pd ON p.id = pd.product_id
WHERE 
    c.id = ?
LIMIT 20;
`,
    [productId], // Truyền giá trị ID vào câu lệnh SQL
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
      res.status(200).json(results); // Trả về tất cả sản phẩm

    }
  );
};
