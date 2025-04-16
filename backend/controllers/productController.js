const pool = require('../config/db');

const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM colchones');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM colchones WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, stock, image } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO colchones (name, description, price, stock, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image } = req.body;

  try {
    const existingProduct = await pool.query('SELECT * FROM colchones WHERE id = $1', [id]);
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const product = existingProduct.rows[0];

    const result = await pool.query(
      'UPDATE colchones SET name=$1, description=$2, price=$3, stock=$4, image=$5 WHERE id=$6 RETURNING *',
      [
        name || product.name,
        description || product.description,
        price || product.price,
        stock || product.stock,
        image || product.image,
        id
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM colchones WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
