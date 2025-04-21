const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const db = require("../config/db");


// Listar usuarios (para el recuadro de clientes)
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
      console.error(error);
      res.status(500).json({ error: "Error al listar usuarios" });
    }
  }
);

router.put(
  "/users/:id/role",
  authMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const userId = req.params.id;
      const { role } = req.body;
      if (!["admin", "user"].includes(role)) {
        return res.status(400).json({ error: "Rol inválido" });
      }

      await db.query(
        "UPDATE users SET role = $1 WHERE id = $2",
        [role, userId]
      );

      res.json({ message: "Rol actualizado correctamente", userId, role });
    } catch (err) {
      console.error("❌ Error al actualizar rol:", err);
      res.status(500).json({ error: "Error al actualizar rol" });
    }
  }
);

module.exports = router;

