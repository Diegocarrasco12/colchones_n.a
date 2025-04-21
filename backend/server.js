require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();

// 🔹 Crear carpeta uploads/profile_images si no existe
const uploadDir = path.join(__dirname, "uploads", "profile_images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Carpeta de uploads creada:", uploadDir);
}

// 🔹 Configuración de CORS (asegúrate de definir ALLOW_ORIGIN_URL en .env)
const FRONTEND_URL = process.env.ALLOW_ORIGIN_URL;
if (!FRONTEND_URL) {
  console.warn(
    "⚠️  ALLOW_ORIGIN_URL no está definida. Pon tu dominio de front en .env"
  );
}
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 🔹 Middlewares generales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Servir archivos estáticos de /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Importar rutas
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");

// 🔹 Montar rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// 🔹 Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando correctamente!");
});

// 🔹 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 🔹 Manejo global de errores
app.use((err, req, res, next) => {
  console.error("❌ Error en el servidor:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 🔹 Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});





