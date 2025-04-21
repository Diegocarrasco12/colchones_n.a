const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const db = require("../config/db");

// 🔒 Panel de administración (mensaje + lista de usuarios)
router.get(
  "/dashboard",
  authMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const { rows } = await db.query(
        "SELECT id, name, email, role, profile_image, created_at FROM users ORDER BY created_at DESC"
      );
      res.json({
        message: "Bienvenido al panel de administrador",
        users: rows,
      });
    } catch (error) {
      console.error("❌ Error al obtener datos del dashboard:", error);
      res.status(500).json({ error: "Error al obtener datos del dashboard" });
    }
  }
);

// 🔒 Listar todos los clientes (solo datos básicos)
router.get(
  "/users",
  authMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const { rows } = await db.query(
        "SELECT id, name AS full_name, email, role, profile_image, created_at FROM users ORDER BY created_at DESC"
      );
      res.json(rows);
    } catch (error) {
      console.error("❌ Error al listar usuarios:", error);
      res.status(500).json({ error: "Error al listar usuarios" });
    }
  }
);

module.exports = router;

