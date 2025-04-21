const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Importamos la carga de archivo y el controlador juntos
const {
  uploadMiddleware,      // esto ya es upload.single("avatar")
  uploadProfileImage,
} = require("../controllers/profileImageController");

// 🔹 Registro e inicio de sesión
router.post("/register", register);
router.post("/login", login);

// 🔹 Perfil del usuario autenticado
router.get("/profile", authMiddleware, getProfile);

// ✅ Subir o actualizar imagen de perfil
//    - authMiddleware primero valida el JWT
//    - luego uploadMiddleware (.single("avatar"))
//    - luego uploadProfileImage guarda la ruta en BD
router.put(
  "/profile-image",
  authMiddleware,
  uploadMiddleware,
  uploadProfileImage
);

// 🔹 Ruta de prueba
router.get("/", (req, res) => {
  res.send("✅ Rutas de autenticación funcionando correctamente!");
});

module.exports = router;
