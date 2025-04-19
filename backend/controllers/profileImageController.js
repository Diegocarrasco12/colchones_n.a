const multer = require("multer");
const path = require("path");
const db = require("../config/db");

// Configurar multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile_images/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `user_${req.user.id}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// 🔹 Controlador para manejar la carga y guardar en la BD
const uploadProfileImage = async (req, res) => {
  try {
    const imagePath = `uploads/profile_images/${req.file.filename}`;

    await db.query(
      "UPDATE users SET profile_image = $1 WHERE id = $2",
      [imagePath, req.user.id]
    );

    res.status(200).json({ message: "Imagen de perfil actualizada", imagePath });
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    res.status(500).json({ error: "Error al guardar la imagen" });
  }
};

module.exports = {
  uploadProfileImage,
  uploadMiddleware: upload.single("profileImage"),
};
