const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const db = require("../config/db");

// 🔒 Ruta protegida para panel de administradores
router.get("/dashboard", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await db.query(
      "SELECT id, name, email, role, profileimage, created_at FROM users ORDER BY created_at DESC"
    );

    res.json({
      message: "Bienvenido al panel de administrador",
      users: users.rows,
    });
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener datos del dashboard" });
  }
});

module.exports = router;
