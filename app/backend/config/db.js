import mysql from "mysql2";
import { config } from "dotenv";
config({ path: ".env", quiet: true });

const pool = mysql.createPool({
  host: "mysql",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "jobagg",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool.promise();
