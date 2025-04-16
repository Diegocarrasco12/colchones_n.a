require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Importar rutas
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// 🔹 Configuración de CORS con variable de entorno
const corsOptions = {
  origin: process.env.ALLOW_ORIGIN_URL || "*", // fallback útil para testing local
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight requests

// 🔹 Middlewares generales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Middleware adicional para encabezados CORS (opcional pero seguro)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN_URL || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// 🔹 Rutas principales
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);

// 🔹 Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando correctamente!");
});

// 🔹 Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 🔹 Manejo global de errores
app.use((err, req, res, next) => {
  console.error("❌ Error en el servidor:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 🔹 Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
