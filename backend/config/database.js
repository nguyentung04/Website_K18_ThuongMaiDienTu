// const mysql = require('mysql2');
// require('dotenv').config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });


// connection.connect((err) => {
//   if (err) {
//     console.error('Lỗi kết nối: ' + err.stack);  
//     return;
//   }
//   console.log('Đã kết nối với id số ' + connection.threadId);
// });

// module.exports = connection;


const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',  // Thay đổi theo cấu hình của bạn
  user: 'root',       // Thay đổi theo cấu hình của bạn
  password: 'mysql',  // Thay đổi theo cấu hình của bạn
  database: 'dong_ho_beed_support', // Thay đổi theo cấu hình của bạn
  waitForConnections: true,
  connectionLimit: 16,
  queueLimit: 0,

});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);  
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
