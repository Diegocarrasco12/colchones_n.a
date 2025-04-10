const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Rutas CRUD para productos
router.get("/", getAllProducts);           // Obtener todos los productos
router.get("/:id", getProductById);        // Obtener un producto por ID
router.post("/", createProduct);           // Crear un nuevo producto
router.put("/:id", updateProduct);         // Actualizar un producto
router.delete("/:id", deleteProduct);      // Eliminar un producto

module.exports = router;

