import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from 'react';
import { useAuth } from '../context/AuthContext';


const AdminProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
    const history = useHistory()

  useEffect(() => {
   
    const fetchProducts = () => {
      const fetchedProducts = [
        { id: 1, name: 'Colchón Premium', price: '$200', image: require('../assets/img/img1.jpg') },
        { id: 2, name: 'Colchón Económico', price: '$150', image: require('../assets/img/img2.jpg') },
        { id: 3, name: 'Colchón Ergonómico', price: '$180', image: require('../assets/img/img3.jpg') },
      ];
      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, [products]);

  const handleDelete = (id) => {
    
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    console.log('Producto eliminado:', id);
  };

  const handleEdit = (id) => {
    
    history.push(`/edit-product/${id}`);
  };

  return (
    <section className="container py-5 text-light">
      <h2 className="text-center mb-4">Productos del Administrador</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100">
              <img
                src={product.image}
                alt={product.name}
                className="card-img-top"
                style={{ objectFit: 'cover', height: '200px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Precio: {product.price}</p>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEdit(product.id)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminProducts;
