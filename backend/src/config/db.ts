import "dotenv/config"
import { Pool } from "pg";
//pool is basically a group of ready-to-use connections between your Node.js application and PostgreSQL.
// Instead of creating a new connection every time your application wants to talk to PostgreSQL, Pool manages multiple connections for you.
//you're basically saying: "Create a manager that will handle connections between my backend and PostgreSQL." Pool = connection manager between your backend and PostgreSQL.

// pool.query();
// Simple meaning: "Pool, execute this SQL query in PostgreSQL and give me the result."
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

if (pool) {
  console.log("postgres database connected successfully");
}
export default pool;
