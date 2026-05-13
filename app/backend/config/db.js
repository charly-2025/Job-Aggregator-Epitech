import mysql from "mysql2";
import { config } from "dotenv";
config({ path: ".env", quiet: true });

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "jobagg",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("MySQL pool connected successfully");
  connection.release();
})

export default pool.promise();
