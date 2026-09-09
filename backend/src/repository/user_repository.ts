import pool from "../config/db.js";

const createUser = async (
  username: string,
  fullname: string,
  email: string,
  password: string,
  role: string = "user",
  address: string | null = null,
  phone: string | null = null,
  avatar_url: string,
  avatar_public_id: string,
) => {
  const result = await pool.query(
    `insert into users (username, fullName, email, password, role, address, phone, avatar_url, avatar_public_id)
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
    [
      username,
      fullname,
      email,
      password,
      role,
      address,
      phone,
      avatar_url,
      avatar_public_id,
    ],
  );

  return result.rows[0];
};

const findUserByUsernameOrEmail = async (username: string, email: string) => {
  const result = await pool.query(
    `select * from users
     where username = $1 or email = $2`,
    [username, email],
  );

  return result.rows[0];
};
export { createUser, findUserByUsernameOrEmail };
