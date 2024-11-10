const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: process.env.DATABASE_URL.split('/').pop()
});

connection.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối: ' + err.stack);  
    return;
  }
  console.log('Đã kết nối với id số ' + connection.threadId);
});

module.exports = connection;
