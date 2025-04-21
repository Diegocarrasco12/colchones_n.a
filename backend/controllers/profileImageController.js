const path = require("path");
const db = require("../config/db");
const upload = require("../middlewares/uploadMiddleware");

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo" });
    }

    // Construimos la ruta relativa para guardar en la BD
    const imagePath = path.join("uploads", "profile_images", req.file.filename);

    await db.query(
      "UPDATE users SET profile_image = $1 WHERE id = $2",
      [imagePath, req.user.id]
    );

    return res
      .status(200)
      .json({ message: "Imagen de perfil actualizada", imagePath });
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    return res.status(500).json({ error: "Error al guardar la imagen" });
  }
};

module.exports = {
  // Usamos el mismo campo que en el frontend: "avatar"
  uploadMiddleware: upload.single("avatar"),
  uploadProfileImage,
};

