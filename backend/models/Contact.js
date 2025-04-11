const pool = require("../config/db");

const createMessage = async ({ name, email, message }) => {
  const result = await pool.query(
    "INSERT INTO contactos (name, email, message, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
    [name, email, message]
  );
  return result.rows[0];
};

module.exports = { createMessage };

