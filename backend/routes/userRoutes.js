const express = require("express");
const { register, login, getProfile } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

// Ruta de prueba
router.get("/", (req, res) => {
  res.send("✅ Ruta de usuarios funcionando correctamente!");
});

module.exports = router;