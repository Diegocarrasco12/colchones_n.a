require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Rutas
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes"); 

const app = express();

// 🔹 Configuración de CORS
const corsOptions = {
  origin: process.env.ALLOW_ORIGIN_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 🔹 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Middleware para CORS en respuestas
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// 🔹 Definir rutas
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes); 
app.use("/api/contact", contactRoutes);  

// 🔹 Ruta raíz
app.get("/", (req, res) => {
  res.send("🚀 Backend funcionando correctamente!");
});

// 🔹 Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// 🔹 Manejo de errores global
app.use((err, req, res, next) => {
  console.error("❌ Error en el servidor:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 🔹 Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
