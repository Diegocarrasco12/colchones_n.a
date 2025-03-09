const pool = require('../config/db');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM colchones');
    console.log(result)
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM colchones WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  const { name, description, price, stock, image } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO colchones (name, description, price, stock, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image } = req.body;
  try {
    const existingProduct = await pool.query('SELECT * FROM colchones WHERE id = $1', [id])
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const product = existingProduct.rows[0]
  
    const result = await pool.query(
      'UPDATE colchones SET name=$1, description=$2, price=$3, stock=$4, image=$5, WHERE id=$6 RETURNING *',
      [name ? name : product.name, description ? description : product.description, price ? price : product.price, stock ? stock : product.stock, image ? image : product.image, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM colchones WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
