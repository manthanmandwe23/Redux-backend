import pool from "./config/db.js";
import app from "./app.js";
import { generateAccessToken } from "./utils/jwt.js";
const connectDB = async () => {
  try {
    await pool.query("select 1");
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.log("PostgreSQL connection failed: ", error);
  }
};

connectDB();

app.listen(process.env.PORT || 8000, () => {
  console.log(`port is listining on port ${process.env.PORT}`);
});


