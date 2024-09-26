const connection = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Example function to get all users
exports.getAllUsers = (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

//login

exports.login = (req, res) => {
  const { username, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi kết nối cơ sở dữ liệu" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Tên đăng nhập không tồn tại" });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi xác thực mật khẩu" });
        }

        if (!isMatch) {
          return res.status(401).json({ message: "Mật khẩu không đúng" });
        }

        const token = jwt.sign({ id: user.id }, "your_jwt_secret", {
          expiresIn: "1h",
        });

        res.status(200).json({ token });
      });
    }
  );
};

// Đăng nhập
exports.loginAdmin = (req, res) => {
  const { username, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi kết nối cơ sở dữ liệu" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Tên đăng nhập không tồn tại" });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi xác thực mật khẩu" });
        }

        if (!isMatch) {
          return res.status(401).json({ message: "Mật khẩu không đúng" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "default_secret", {
          expiresIn: "1h",
        });

        res.status(200).json({
          token,
          username: user.username,
          role: user.role
        });
      });
    }
  );
};


exports.register = (req, res) => {
  const { username, email, password } = req.body;

  // Kiểm tra xem tên đăng nhập đã tồn tại chưa
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi kết nối cơ sở dữ liệu" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
      }

      // Kiểm tra xem email đã tồn tại chưa
      connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Lỗi kết nối cơ sở dữ liệu" });
          }

          if (results.length > 0) {
            return res.status(400).json({ message: "Email đã tồn tại" });
          }

          // Mã hóa mật khẩu và lưu người dùng vào cơ sở dữ liệu
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
              return res.status(500).json({ message: "Lỗi mã hóa mật khẩu" });
            }

            connection.query(
              "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
              [username, email, hashedPassword],
              (err, results) => {
                if (err) {
                  return res
                    .status(500)
                    .json({
                      message: "Lỗi khi lưu người dùng vào cơ sở dữ liệu",
                    });
                }

                res.status(200).json({ message: "Đăng ký thành công!" });
              }
            );
          });
        }
      );
    }
  );
};

exports.getUserById = (req, res) => {
  const userId = req.params.id; //Sử dụng cách đặt tên camelCase nhất quán

  // Query the database to get user by ID
  connection.query(
    "SELECT * FROM users WHERE id = ?", // SQL query
    [userId], // Truy vấn tham số hóa để ngăn chặn SQL injection
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

exports.deleteUser = (req, res) => {
  const userId = req.params.id; // Use consistent camelCase naming

  // Prepare the SQL query to delete the user
  const query = "DELETE FROM Users WHERE id = ?";

  // Execute the query
  connection.query(query, [userId], (err, results) => {
    if (err) {
      // Log the error and respond with a 500 status code
      console.error("Database query error:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the user." });
    }

    // Check if any rows were affected (i.e., if the user was deleted)
    if (results.affectedRows === 0) {
      // If no rows were affected, respond with a 404 status code
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "User deleted successfully" });
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, phone, password, email, image, username, role } = req.body;

  // Prepare the SQL query
  const query = `
    UPDATE Users SET name=?, image=?, phone=?, password=?, email=?, username=?, role=? 
    WHERE id = ?;
  `;
  const values = [name, image, phone, password, email, username, role, userId];

  // Execute the query
  connection.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  });
};

exports.postUsers = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);
   
    const {
      name,
      phone,
      password,
      email,
      username,
      role,
    } = req.body;
   

    const query = `
      INSERT INTO users( name,  phone, password, email, username, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      name,
      phone,
      password,
      email,
      username,
      role,
    ];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: err.message });
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