const express = require("express");
const router = express.Router();
// const pool = require("../config/db");
// const authMiddleware = require("../middlewares/authMiddleware");
const { getAllProducts } = require("../controllers/productController");

router.get("/", getAllProducts);

module.exports = router;

// // ✅ Obtener todos los productos (No requiere autenticación)
// router.get("/", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
//     res.json({ success: true, products: result.rows });
//   } catch (error) {
//     console.error("❌ Error al obtener productos:", error);
//     res.status(500).json({ success: false, error: "Error al obtener productos" });
//   }
// });

// // ✅ Obtener un producto por ID
// router.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, error: "Producto no encontrado" });
//     }
//     res.json({ success: true, product: result.rows[0] });
//   } catch (error) {
//     console.error("❌ Error al obtener el producto:", error);
//     res.status(500).json({ success: false, error: "Error al obtener el producto" });
//   }
// });

// // ✅ Agregar un nuevo producto (Requiere autenticación)
// router.post("/", authMiddleware, async (req, res) => {
//   const { name, description, price, stock } = req.body;
//   try {
//     const result = await pool.query(
//       "INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *",
//       [name, description, price, stock]
//     );
//     res.status(201).json({ success: true, message: "Producto agregado", product: result.rows[0] });
//   } catch (error) {
//     console.error("❌ Error al agregar producto:", error);
//     res.status(500).json({ success: false, error: "Error al agregar producto" });
//   }
// });

// // ✅ Actualizar un producto (Requiere autenticación)
// router.put("/:id", authMiddleware, async (req, res) => {
//   const { name, description, price, stock } = req.body;
//   const { id } = req.params;
//   try {
//     const result = await pool.query(
//       "UPDATE products SET name=$1, description=$2, price=$3, stock=$4 WHERE id=$5 RETURNING *",
//       [name, description, price, stock, id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, error: "Producto no encontrado" });
//     }
//     res.json({ success: true, message: "Producto actualizado", product: result.rows[0] });
//   } catch (error) {
//     console.error("❌ Error al actualizar producto:", error);
//     res.status(500).json({ success: false, error: "Error al actualizar producto" });
//   }
// });

// // ✅ Eliminar un producto (Requiere autenticación)
// router.delete("/:id", authMiddleware, async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ success: false, error: "Producto no encontrado" });
//     }
//     res.json({ success: true, message: "Producto eliminado", deletedProduct: result.rows[0] });
//   } catch (error) {
//     console.error("❌ Error al eliminar producto:", error);
//     res.status(500).json({ success: false, error: "Error al eliminar producto" });
//   }
// });

// module.exports = router;

