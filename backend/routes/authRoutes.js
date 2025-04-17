const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

// Ruta de prueba
router.get("/", (req, res) => {
  res.send("✅ Rutas de autenticación funcionando correctamente!");
});

module.exports = router;
