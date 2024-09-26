const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',  // Thay đổi theo cấu hình của bạn
  user: 'root',       // Thay đổi theo cấu hình của bạn
  password: 'mysql',  // Thay đổi theo cấu hình của bạn
  database: 'dong_ho_bee' // Thay đổi theo cấu hình của bạn
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
