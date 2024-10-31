const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql',
  database: 'dong_ho_bee'
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);  
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
