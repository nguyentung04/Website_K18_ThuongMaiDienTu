const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../config/database');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc!' });
  }

  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Tài khoản không tồn tại!' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Mật khẩu không chính xác!' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.process.env.JWT_SECRET || console.log("JWT_SECRET is not set"), { expiresIn: '1h' });

      console.log("Email Login Successful:", {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        token,
        expiresIn: 3600,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
};


exports.googleAuth = async (req, res) => {
  const { id, name, email, image } = req.user; // Thông tin từ Google OAuth

  try {
    // Kiểm tra xem người dùng có tồn tại trong database hay không
    const results = await query('SELECT * FROM users WHERE google_id = ? OR email = ?', [id, email]);

    let user = results.length > 0 ? results[0] : null;

    if (!user) {
      // Người dùng chưa tồn tại, tạo mới
      const newUser = {
        google_id: id,                    // ID từ Google
        name,                             // Tên người dùng
        email,                            // Email người dùng
        image,                            // Ảnh người dùng
        username: name.replace(/\s+/g, '').toLowerCase(), // Tạo username từ tên
        role: 'user',                     // Vai trò mặc định là 'user'
        status: '1',                      // Trạng thái người dùng
        createdAt: new Date(),            // Ngày tạo
      };

      // Thêm người dùng mới vào database
      const insertResult = await query('INSERT INTO users SET ?', newUser);
      newUser.id = insertResult.insertId; // Lấy ID của người dùng mới
      user = newUser;                     // Gán người dùng mới vào biến user
    }

    // Tạo JWT token cho người dùng
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirect đến frontend với token
    return res.redirect(`http://localhost:3001?token=${token}`);
  } catch (err) {
    console.error("GoogleAuth error:", err.message); // Log lỗi nếu có
    return res.status(500).json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau!' }); // Trả về lỗi
  }
};




function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Bạn cần phải đăng nhập' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Invalid Token:", err.message);
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
