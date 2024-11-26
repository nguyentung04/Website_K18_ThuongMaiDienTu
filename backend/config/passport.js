const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connection = require('./database');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 10;

dotenv.config();

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      google_id: user.google_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}


passport.use(new GoogleStrategy({
  clientID: process.env.GF_CLIENT_ID,
  clientSecret: process.env.GF_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/google/callback"
},
  (accessToken, refreshToken, profile, done) => {
    connection.query('SELECT * FROM users WHERE google_id = ?', [profile.id], (err, results) => {
      if (err) return done(err);
      if (results.length > 0) {
        return done(null, results[0]);
      } else {
        // Tạo đối tượng newUser
        const newUser = {
          google_id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
          password: 'your_encrypted_password_here', // mật khẩu tạm thời, sẽ mã hóa sau
          role: 'user',  // Hoặc giá trị mặc định bạn muốn
          status: '1',  // Hoặc giá trị mặc định bạn muốn
          createdAt: new Date(),
          image: profile.photos ? profile.photos[0].value : null,  // Nếu Google trả về ảnh đại diện
        };

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
          if (err) return done(err);
          newUser.password = hash; // Cập nhật mật khẩu đã mã hóa

          // Lưu người dùng vào cơ sở dữ liệu
          connection.query('INSERT INTO users SET ?', newUser, (err, result) => {
            if (err) return done(err);
            newUser.id = result.insertId; // Gán id người dùng vừa tạo
            return done(null, newUser); // Trả lại thông tin người dùng
          });
        });
      }
    });
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
