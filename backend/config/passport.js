const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connection = require('./database'); // Kết nối đến database của bạn

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback"
},
    (accessToken, refreshToken, profile, done) => {
        // Kiểm tra người dùng trong cơ sở dữ liệu hoặc tạo mới nếu chưa có
        connection.query('SELECT * FROM users WHERE google_id = ?', [profile.id], (err, results) => {
            if (err) return done(err);
            
            if (results.length > 0) {
                return done(null, results[0]); // Người dùng đã tồn tại
            } else {
                // Thêm người dùng mới vào database
                const newUser = {
                    google_id: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    username: profile.displayName.replace(/\s+/g, '').toLowerCase(),  // Tạo username tự động từ tên
                    password: 'your_encrypted_password_here', // Cung cấp password ở đây
                };
        
                connection.query('INSERT INTO users SET ?', newUser, (err, result) => {
                    if (err) return done(err);
                    newUser.id = result.insertId;
                    return done(null, newUser);
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
        done(null, results[0]);
    });
});

module.exports = passport;
