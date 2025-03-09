import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const apiURL = `${import.meta.env.VITE_API_BASE_URL}/api/products`;

const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useAuth();

  useEffect(() => {
    axios.get(apiURL)
      .then(response => setProducts(response.data))
      .catch(error => console.error("❌ Error al obtener productos:", error));
  }, []);

  return (
    <section className="container">
      <h2>Nuestros Colchones</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="col-md-4" key={product.id}>
              <div className="card">
                <img src={product.image} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5>{product.name}</h5>
                  <p>${product.price}</p>
                  <button className="btn btn-success" onClick={() => addToCart(product)}>Agregar</button>
                  <Link to={`/product/${product.id}`} className="btn btn-primary">Detalles</Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Cargando productos...</p>
        )}
      </div>
    </section>
  );
};

export default ProductGallery;

