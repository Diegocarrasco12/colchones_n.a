const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Conexión exitosa a PostgreSQL 🚀");
    const res = await client.query("SELECT NOW();");
    console.log("📅 Fecha y hora del servidor:", res.rows[0]);
    client.release();
  } catch (error) {
    console.error("❌ Error de conexión a PostgreSQL:", error.message);
  }
}

testConnection();
