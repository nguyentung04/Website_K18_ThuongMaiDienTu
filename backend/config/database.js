const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
<<<<<<< HEAD
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
=======
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: process.env.DATABASE_URL.split('/').pop()
>>>>>>> bae40f60210a5cc4d28947e7e239daa3fa0e64dc
});


connection.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối: ' + err.stack);  
    return;
  }
  console.log('Đã kết nối với id số ' + connection.threadId);
});

module.exports = connection;
