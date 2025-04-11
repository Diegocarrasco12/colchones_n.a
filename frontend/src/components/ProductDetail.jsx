import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useAuth();
  const [product, setProduct] = useState(null);

  const apiURL = `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`;

  useEffect(() => {
    axios.get(apiURL)
      .then(response => setProduct(response.data))
      .catch(error => console.error("❌ Error al obtener detalle del producto:", error));
  }, [id]);

  if (!product) {
    return <div className="container py-5 text-center text-light">Cargando detalles del producto...</div>;
  }

  return (
    <section className="container text-light py-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={`/${product.image}`}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ objectFit: "cover", height: "400px", width: "100%" }}
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p><strong>Precio:</strong> ${product.price.toLocaleString()} CLP</p>
          <p><strong>Descripción:</strong> {product.description}</p>
          <button className="btn btn-success mt-3" onClick={() => addToCart(product)}>Agregar al Carrito</button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

