const connection = require("../config/database");

// Get all cities
exports.getAllCities = (req, res) => {
  connection.query("SELECT * FROM cities", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Get a city by ID
exports.getCitiesById = (req, res) => {
  const cityId = req.params.id; // Use consistent camelCase naming

  // Query the database to get city by ID
  connection.query(
    "SELECT * FROM cities WHERE id = ?", // SQL query
    [cityId], // Parametrized query to prevent SQL injection
    (err, results) => {
      if (err) {
        // Log the error and respond with a 500 status code
        console.error("Database query error:", err);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi khi tìm kiếm thành phố/quận/huyện" });
      }

      if (results.length === 0) {
        // If no city is found, respond with a 404 status code
        return res.status(404).json({ message: "City not found" });
      }

      // Respond with the city data
      res.status(200).json(results[0]);
    }
  );
};

// Delete a city
// exports.deleteCities = (req, res) => {
//   const cityId = req.params.id; // Use consistent camelCase naming

//   // Prepare the SQL query to delete the city
//   const query = "DELETE FROM cities WHERE id = ?";

//   // Execute the query
//   connection.query(query, [cityId], (err, results) => {
//     if (err) {
//       // Log the error and respond with a 500 status code
//       console.error("Database query error:", err);
//       return res
//         .status(500)
//         .json({ error: "Đã xảy ra lỗi khi xóa thành phố." });
//     }

//     // Check if any rows were affected (i.e., if the city was deleted)
//     if (results.affectedRows === 0) {
//       // If no rows were affected, respond with a 404 status code
//       return res.status(404).json({ message: "City not found" });
//     }

//     // Respond with a success message
//     res.status(200).json({ message: "Xóa thành phố thành công" });
//   });
// };

// Update a city
exports.updateCities = (req, res) => {
  const cityId = req.params.id;
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  // Prepare the SQL query
  const query = `
    UPDATE cities SET name = ?
    WHERE id = ?;
  `;
  const values = [name, cityId];

  // Execute the query
  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(200).json({ message: "Cập nhật thành phố/quận/huyện thành công" });
  });
};

// Create a new city
exports.postCities = (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  // Prepare the SQL query to insert a new city
  const query = `
    INSERT INTO cities (name)
    VALUES (?);
  `;
  const values = [name]; // Use name value

  // Execute the query
  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Thêm thành phố/quận/huyện thành công!",
      cityId: results.insertId, // Return the ID of the newly created city
    });
  });
};

exports.deleteCities = (req, res) => {
  const { id } = req.params;

  // Bắt đầu transaction
  connection.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Xóa chi tiết đơn hàng trước
    connection.query(
      "DELETE FROM districts WHERE city_id  = ?",
      [id],
      (err) => {
        if (err) {
          return connection.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        // Xóa đơn hàng
        connection.query("DELETE FROM cities WHERE id = ?", [id], (err) => {
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