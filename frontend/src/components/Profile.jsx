import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiURL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState("/img/default_avatar.png");
  const [error, setError] = useState("");
  
  // Nuevo: estado para clientes y productos
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user) return navigate("/login");
    if (user.profileImage) {
      setPreview(`${apiURL}/${user.profileImage}`);
    }
    // Si es admin, cargo clientes y productos
    if (user.role === "admin") {
      axios.get(`${apiURL}/api/admin/users`)
        .then(res => setClients(res.data))
        .catch(console.error);

      axios.get(`${apiURL}/api/products`)
        .then(res => setProducts(res.data))
        .catch(console.error);
    }
  }, [user]);

  /* … el resto de lo que ya tenías para subir la foto … */

  if (!user) return null;

  return (
    <div className="container mt-5 text-light">
      <h2 className="text-center">Perfil de {user.fullName || user.name}</h2>
      <p className="text-center"><strong>Email:</strong> {user.email}</p>

      {/* Foto de perfil */}
      <div className="text-center mb-5">
        {/* … tu recuadro clicable con preview … */}
      </div>

      {/* --- Sección de ADMIN only --- */}
      {user.role === "admin" && (
        <>
          {/* 1) Lista de Clientes */}
          <div className="card mb-4">
            <div className="card-header">Clientes Registrados</div>
            <div className="card-body p-0">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>Nombre</th><th>Email</th><th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(c => (
                    <tr key={c.id}>
                      <td>{c.full_name}</td>
                      <td>{c.email}</td>
                      <td>{c.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2) Gestión de Productos */}
          <div className="card mb-4">
            <div className="card-header">Gestión de Productos</div>
            <div className="card-body">
              {/* 
                Aquí podrías reutilizar tu componente de CRUD de productos, 
                o incluir un listado + botones “Editar” / “Borrar” / “Agregar”:
              */}
              {products.map(p => (
                <div key={p.id} className="d-flex justify-content-between align-items-center mb-2">
                  <span>{p.name} — ${p.price}</span>
                  <div>
                    <button className="btn btn-sm btn-warning me-2">Editar</button>
                    <button className="btn btn-sm btn-danger">Borrar</button>
                  </div>
                </div>
              ))}

              <button className="btn btn-sm btn-success">
                Agregar Nuevo Producto
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- Botones de acción comunes --- */}
      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Volver al Inicio
        </button>
        {/* Nuevo: siempre visible, para volver al perfil desde cualquier página */}
        <button className="btn btn-secondary" onClick={() => navigate("/profile")}>
          Mi Perfil
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Profile;


