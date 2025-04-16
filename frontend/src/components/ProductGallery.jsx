import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// Ruta base a la API
const apiURL = `${import.meta.env.VITE_API_BASE_URL}/api/products`;

const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useAuth();

  // Obtener productos desde el backend
  useEffect(() => {
    axios
      .get(apiURL)
      .then((response) => setProducts(response.data))
      .catch((error) =>
        console.error("❌ Error al obtener productos:", error)
      );
  }, []);

  return (
    <section className="container">
      <h2>Nuestros Colchones</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={`/img/${product.image}`}
                  alt={product.name}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "200px",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem"
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    {product.price.toLocaleString()} CLP
                  </p>
                  <div className="mt-auto">
                    <button
                      className="btn btn-success me-2"
                      onClick={() => addToCart(product)}
                    >
                      Agregar
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-primary"
                    >
                      Detalles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">
            Cargando productos o no hay productos disponibles.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductGallery;
