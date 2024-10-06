const connection = require("../config/database");

exports.getAllProduct_Details = (req, res) => {
  connection.query(
    `SELECT pr.*, prd.*, ct.*, ct.name AS category
FROM products pr
INNER JOIN product_detail prd ON pr.id = prd.product_id
INNER JOIN categories ct ON pr.category_id = ct.id;
 `,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};

exports.getProductDetailById = (req, res) => {
  // const productId = req.params.id;
  const productDetailId = req.params.id;
  connection.query(
    `SELECT pr.*, prd.*, ct.*, ct.name AS category
FROM products pr
INNER JOIN product_detail prd ON pr.id = prd.product_id
INNER JOIN categories ct ON pr.category_id = ct.id
 WHERE prd.product_id = ?`,
    [productDetailId],
    // [productId],
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

exports.updateProductDetail = (req, res) => {
  const productId = req.params.id; // Use product_id from the URL params
  const {
    machineType,
    identification,
    thickness,
    wireMaterial,
    antiWater,
    gender,
    coler, // Ensure this is "coler" instead of "coler"
  } = req.body;

  // Validate input fields
  if (
    !machineType ||
    !identification ||
    !thickness ||
    !wireMaterial ||
    !antiWater ||
    !gender ||
    !coler // Validate using "coler"
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required for updating" });
  }

  // Prepare the SQL query to update multiple fields
  const query = `
    UPDATE product_detail
    SET machineType = ?, identification = ?, thickness = ?, wireMaterial = ?, antiWater = ?, gender = ?, coler = ?
    WHERE product_id = ?;  -- Make sure to use product_id instead of id
  `;
  const values = [
    machineType,
    identification,
    thickness,
    wireMaterial,
    antiWater,
    gender,
    coler, // Use "color" here
    productId, // Use product_id for the WHERE clause
  ];

  // Execute the query
  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "ProductDetail not found" });
    }
    res.status(200).json({ message: "ProductDetail updated successfully" });
  });
};

exports.postProductDetail = (req, res) => {
  const {
    machineType,
    identification,
    thickness,
    wireMaterial,
    antiWater,
    gender,
    coler,
    product_id,
  } = req.body;

  // Validate input
  if (!machineType || !identification || !thickness || !wireMaterial || !antiWater || !gender || !coler || !product_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Prepare the SQL query
  const query = `
    INSERT INTO product_detail (machineType, identification, thickness, wireMaterial, antiWater, gender, coler, product_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    machineType,
    identification,
    thickness,
    wireMaterial,
    antiWater,
    gender,
    coler,
    product_id,
  ];

  // Execute the query
  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Product detail created successfully",
      productDetailId: results.insertId, // Return the ID of the newly created product detail
    });
  });
};

exports.getAllProduct_not_in_the_table = (req, res) => {
  connection.query(
    `SELECT p.*
FROM products p
LEFT JOIN product_detail pd ON p.id = pd.product_id
WHERE pd.product_id IS NULL;

 `,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
};
