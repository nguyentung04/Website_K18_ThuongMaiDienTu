const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',       // Địa chỉ máy chủ MySQL
  user: 'root',            // Tên đăng nhập MySQL
  password: 'mysql', // Mật khẩu MySQL
  database: 'dong_ho_bee', // Tên cơ sở dữ liệu
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);  
    return;
  }
  console.log('Đã kết nối với id số ' + connection.threadId);
});

module.exports = connection;

// const mysql = require('mysql2');

// // Tạo kết nối đến cơ sở dữ liệu
// const connection = mysql.createConnection({
//   host: 'localhost',       // Địa chỉ máy chủ MySQL
//   user: 'root',            // Tên đăng nhập MySQL
//   password: '', // Mật khẩu MySQL
//   database: 'dong_ho_bee'  // Tên cơ sở dữ liệu
// });

// // Kiểm tra kết nối
// connection.connect((err) => {
//   if (err) {
//     console.error('Kết nối thất bại:', err);
//     return;
//   }
//   console.log('Kết nối MySQL thành công!');
// });

// module.exports = connection;
