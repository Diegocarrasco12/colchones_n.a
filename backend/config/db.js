const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  max: 5, 
  idleTimeoutMillis: 30000, 
});

// 🔹 Verificar conexión a la base de datos
pool.connect()
  .then(client => {
    console.log("✅ Conexión exitosa a PostgreSQL 🚀");
    client.release();
  })
  .catch(error => {
    console.error("❌ Error de conexión a PostgreSQL:", error.message);
  });

module.exports = pool;
