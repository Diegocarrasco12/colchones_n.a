const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Obtener todas las órdenes (Admin o usuario autenticado)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT orders.*, users.name AS user_name 
       FROM orders 
       JOIN users ON orders.user_id = users.id 
       ORDER BY created_at DESC`
    );
    res.json({ success: true, orders: result.rows });
  } catch (error) {
    console.error("❌ Error al obtener órdenes:", error);
    res.status(500).json({ success: false, error: "Error al obtener órdenes" });
  }
});

// ✅ Obtener una orden por ID
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const order = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (order.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Orden no encontrada" });
    }

    const items = await pool.query(
      `SELECT order_items.*, products.name 
       FROM order_items 
       JOIN products ON order_items.product_id = products.id 
       WHERE order_id = $1`,
      [id]
    );

    res.json({ success: true, order: order.rows[0], items: items.rows });
  } catch (error) {
    console.error("❌ Error al obtener la orden:", error);
    res.status(500).json({ success: false, error: "Error al obtener la orden" });
  }
});

// ✅ Crear una nueva orden (Usuario autenticado)
router.post("/", authMiddleware, async (req, res) => {
  const { user_id, items } = req.body;

  try {
    // Calcular el precio total
    let totalPrice = 0;
    for (let item of items) {
      const product = await pool.query("SELECT price FROM products WHERE id = $1", [item.product_id]);
      if (product.rows.length === 0) {
        return res.status(400).json({ success: false, error: "Producto no encontrado" });
      }
      totalPrice += product.rows[0].price * item.quantity;
    }

    // Insertar la orden
    const orderResult = await pool.query(
      "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *",
      [user_id, totalPrice]
    );
    const orderId = orderResult.rows[0].id;

    // Insertar los productos en la orden
    for (let item of items) {
      const product = await pool.query("SELECT price FROM products WHERE id = $1", [item.product_id]);
      const subtotal = product.rows[0].price * item.quantity;

      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, subtotal) VALUES ($1, $2, $3, $4)",
        [orderId, item.product_id, item.quantity, subtotal]
      );
    }

    res.status(201).json({ success: true, message: "Orden creada exitosamente", order: orderResult.rows[0] });
  } catch (error) {
    console.error("❌ Error al crear orden:", error);
    res.status(500).json({ success: false, error: "Error al crear orden" });
  }
});

// ✅ Actualizar el estado de una orden
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Orden no encontrada" });
    }

    res.json({ success: true, message: "Orden actualizada", order: result.rows[0] });
  } catch (error) {
    console.error("❌ Error al actualizar orden:", error);
    res.status(500).json({ success: false, error: "Error al actualizar orden" });
  }
});

// ✅ Eliminar una orden
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM orders WHERE id=$1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Orden no encontrada" });
    }

    res.json({ success: true, message: "Orden eliminada", deletedOrder: result.rows[0] });
  } catch (error) {
    console.error("❌ Error al eliminar orden:", error);
    res.status(500).json({ success: false, error: "Error al eliminar orden" });
  }
});

module.exports = router;
