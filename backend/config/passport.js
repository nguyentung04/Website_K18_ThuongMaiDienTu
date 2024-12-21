const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connection = require('./database');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { promisify } = require('util');

dotenv.config();

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,  // Không cần mã hóa thêm
      google_id: user.google_id,
      email: user.email,
      phone: user.phone,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}


// Chuyển query thành Promise
const query = promisify(connection.query).bind(connection);

// Tìm người dùng trong cơ sở dữ liệu
passport.use(new GoogleStrategy({
  clientID: process.env.GF_CLIENT_ID,
  clientSecret: process.env.GF_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Kiểm tra người dùng có tồn tại
    const results = await query('SELECT * FROM users WHERE google_id = ?', [profile.id]);

    if (results.length > 0) {
      return done(null, results[0]); // Trả về thông tin người dùng
    }

    // Nếu chưa tồn tại, thêm người dùng mới
    const newUser = {
      google_id: profile.id,
      email: profile.emails[0]?.value || null,
      name: profile.displayName || 'Anonymous', // Đảm bảo không có mã hóa không cần thiết
      username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
      role: 'user',
      status: '1',
      createdAt: new Date(),
      image: profile.photos?.[0]?.value || null,
    };
    
    

    const result = await query('INSERT INTO users SET ?', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return done(err);
    if (results.length > 0) {
      done(null, results[0]);
    } else {
      done(new Error('User not found'), null);
    }
  });
});

module.exports = { generateToken, passport };
