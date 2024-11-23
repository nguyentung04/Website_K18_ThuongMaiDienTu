  const connection = require("../config/database");
  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcrypt");
  const nodemailer = require('nodemailer');
  const crypto = require('crypto');

  //Minh Cảnh
  // Lấy tất cả người dùng
  exports.getAllUsers = (req, res) => {
    connection.query("SELECT id, name, username, email, phone, status, role, createdAt FROM users", (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    });
  };

  // Đăng nhập người dùng
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

          const { password, ...userData } = user;

          res.status(200).json({
            token,
            user: userData,
          });
        });
      }
    );
  };

  // Đăng nhập quản trị viên
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
    const { username, name, phone, email, password } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "Thông tin không đầy đủ" });
    }

    connection.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi kết nối cơ sở dữ liệu" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
      }

      connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi kết nối cơ sở dữ liệu" });
        }

        if (results.length > 0) {
          return res.status(400).json({ message: "Email đã tồn tại" });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({ message: "Lỗi mã hóa mật khẩu" });
          }

          connection.query("INSERT INTO users (username, name, phone, email, password, status, createdAt) VALUES (?, ?, ?, ?, ?, '1', NOW())", [username, name, phone, email, hashedPassword], (err, results) => {
            if (err) {
              return res.status(500).json({ message: "Lỗi khi lưu người dùng vào cơ sở dữ liệu" });
            }

            res.status(200).json({ message: "Đăng ký thành công!" });
          });
        });
      });
    });
  };


  // Lấy người dùng theo ID
  exports.getUserById = (req, res) => {
    const userId = req.params.id;

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
          return res
            .status(500)
            .json({ error: "Đã xảy ra lỗi khi tìm kiếm người dùng." });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        res.status(200).json(results[0]);
      }
    );
  };

  // Xóa người dùng
  exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    const query = "DELETE FROM Users WHERE id = ?";

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi khi xóa người dùng." });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.status(200).json({ message: "Xóa người dùng thành công" });
    });
  };

  // Cập nhật người dùng
  exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { name, image, phone, email, username, role, status } = req.body;

    // Tạo mảng để lưu các trường cần cập nhật
    const fieldsToUpdate = [];
    const values = [];

    // Kiểm tra từng trường và thêm vào mảng nếu có giá trị
    if (name) {
      fieldsToUpdate.push("name = ?");
      values.push(name);
    }
    if (image) {
      fieldsToUpdate.push("image = ?");
      values.push(image);
    }
    if (phone) {
      fieldsToUpdate.push("phone = ?");
      values.push(phone);
    }
    if (email) {
      fieldsToUpdate.push("email = ?");
      values.push(email);
    }
    if (username) {
      fieldsToUpdate.push("username = ?");
      values.push(username);
    }
    if (role) {
      fieldsToUpdate.push("role = ?");
      values.push(role);
    }
    if (status) {
      fieldsToUpdate.push("status = ?");
      values.push(status);
    }

    // Thêm ID vào cuối cùng
    values.push(userId);

    // Nếu không có trường nào để cập nhật
    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: "Không có thông tin nào để cập nhật." });
    }

    const query = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

    connection.query(query, values, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      res.status(200).json({ message: "Cập nhật người dùng thành công" });
    });
  };


  // Thêm người dùng mới
  exports.postUsers = async (req, res, next) => {
    try {
      console.log("Dữ liệu gửi từ yêu cầu:", req.body);

      const { name, phone, password, email, username, role } = req.body;

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO users(name, phone, password, email, username, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [name, phone, hashedPassword, email, username, role];

      connection.query(query, values, (err, results) => {
        if (err) {
          console.error("Lỗi cơ sở dữ liệu:", err);
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          message: "Thêm người dùng thành công",
          userId: results.insertId,
        });
      });
    } catch (error) {
      console.error("Lỗi máy chủ:", error);
      next(error);
    }
  };

  exports.updatePassword = async (req, res) => {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại và mật khẩu mới là bắt buộc!!' });
    }

    connection.query('SELECT * FROM users WHERE id = ?', [userId], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu', error: err });
      }

      const user = result[0];
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      // Kiểm tra mật khẩu hiện tại
      const currentPasswordMatch = await bcrypt.compare(currentPassword, user.password);  
      if (!currentPasswordMatch) {
        return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
      }

      // Mã hóa mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Không cập nhật được mật khẩu', error: err });
        }

        return res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
      });
    });
  };


  exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return res.status(500).json({ message: 'Lỗi cơ sở dữ liệu', error: err });
      if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy email' });

      const token = crypto.randomBytes(32).toString('hex');
      const expiration = new Date(Date.now() + 3600000);

      connection.query(
        'UPDATE users SET resetToken = ?, resetTokenExpires = ? WHERE email = ?',
        [token, expiration, email],
        (err) => {
          if (err) return res.status(500).json({ message: 'Không lưu được', error: err });

          // Cấu hình Nodemailer
          const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) return res.status(500).json({ message: 'Không gửi được email', error: err });

            res.status(200).json({ message: 'Đã gửi thành công', info });
          });
        }
      );
    });
  };

  exports.resetPassword = (req, res) => {
    const { token, newPassword } = req.body;

    connection.query(
      'SELECT * FROM users WHERE resetToken = ? AND resetTokenExpires > NOW()',
      [token],
      (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(400).json({ message: 'Không hợp lệ' });

        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        connection.query(
          'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE resetToken = ?',
          [hashedPassword, token],
          (err) => {
            if (err) return res.status(500).json({ message: 'Cập nhaat thất bại', error: err });

            res.status(200).json({ message: 'Cập nhật maatj khẩu thành công' });
          }
        );
      }
    );
  };
