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


exports.googleAuth = (req, res) => {
  const { id, name, email, avatar } = req.user;

  connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi kết nối cơ sở dữ liệu" });
    }

    let user = results.length > 0 ? results[0] : null;

    if (!user) {
      const newUser = {
        google_id: id,
        name,
        email,
        avatar,
        username: name.replace(/\s+/g, '').toLowerCase(),
        password: 'google_user_password',
        role: 'user',
        status: '1',  
      };

      connection.query("INSERT INTO users SET ?", newUser, (insertErr, result) => {
        if (insertErr) {
          return res.status(500).json({ error: "Lỗi khi thêm người dùng" });
        }

        newUser.id = result.insertId;
        const token = jwt.sign({ 
          id: newUser.id, 
          username: newUser.username,
          email: newUser.email,
          role: newUser.role 
        }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        return res.redirect(`http://localhost:3001?token=${token}`);
      });
    } else {
      const token = jwt.sign({ 
        id: user.id, 
        username: user.username,
        email: user.email,
        role: user.role 
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      return res.redirect(`http://localhost:3001?token=${token}`);
    }
  });
};


function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log("Token received:", token);
  if (!token) {
    return res.status(401).json({ message: 'Bạn cần phải đăng nhập' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }
    req.user = user;
    next();
  });
}



module.exports = authenticateToken;