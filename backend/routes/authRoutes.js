const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Importar controlador de imagen de perfil
const {
  uploadProfileImage,
  uploadMiddleware,
} = require("../controllers/profileImageController");

// 🔹 Registro e inicio de sesión
router.post("/register", register);
router.post("/login", login);

// 🔹 Perfil del usuario autenticado
router.get("/profile", authMiddleware, getProfile);

// ✅ Subir o actualizar imagen de perfil
router.put("/profile-image", authMiddleware, uploadMiddleware, uploadProfileImage);

// Ruta de prueba
router.get("/", (req, res) => {
  res.send("✅ Rutas de autenticación funcionando correctamente!");
});

module.exports = router;
