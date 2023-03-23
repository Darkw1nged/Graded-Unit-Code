import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'college',
  password: '99Bootboy!',
  port: 3306, // default MySQL port
});

export default pool.promise();
