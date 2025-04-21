import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiURL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Estado de la foto y posible error
  const [preview, setPreview] = useState("/img/default_avatar.png");
  const [error, setError] = useState("");

  // Datos de admin: clientes y productos
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  // Al montar o cambiar user, cargo preview, clientes y productos
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.profileImage) {
      setPreview(`${apiURL}/${user.profileImage}`);
    }

    if (user.role === "admin") {
      // Cargo lista de clientes
      axios
        .get(`${apiURL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setClients(res.data))
        .catch(console.error);

      // Cargo productos
      axios
        .get(`${apiURL}/api/products`)
        .then((res) => setProducts(res.data))
        .catch(console.error);
    }
  }, [user, navigate, token]);

  // Abrir selector de archivo
  const handleImageClick = () => fileInputRef.current.click();

  // Subir nueva foto
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await axios.put(
        `${apiURL}/api/auth/profile-image`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPreview(URL.createObjectURL(file));
      setError("");
    } catch (err) {
      console.error("❌ Error al subir imagen:", err.response || err);
      setError("Error al subir imagen.");
    }
  };

  // NUEVO: Cambiar rol de un usuario
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `${apiURL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Actualizo estado local
      setClients((prev) =>
        prev.map((c) =>
          c.id === userId
            ? { ...c, role: newRole }
            : c
        )
      );
    } catch (err) {
      console.error("❌ Error al cambiar rol:", err.response || err);
    }
  };

  if (!user) return null;

  return (
    <div className="container mt-5 text-light">
      <h2 className="text-center">Perfil de {user.fullName || user.name}</h2>
      <p className="text-center">
        <strong>Email:</strong> {user.email}
      </p>

      {/* — Foto de perfil clicable — */}
      <div className="text-center mb-5">
        <h5>Cambiar Foto de Perfil</h5>
        <div
          onClick={handleImageClick}
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "8px",
            overflow: "hidden",
            margin: "0 auto 10px",
            cursor: "pointer",
            border: "2px solid #ccc",
          }}
        >
          <img
            src={preview}
            alt="Foto de perfil"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/img/default_avatar.png";
            }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {error && <p className="text-danger">{error}</p>}
      </div>

      {/* — Sección ADMIN (solo si role === 'admin') — */}
      {user.role === "admin" && (
        <>
          {/* Lista de Clientes con selector de rol */}
          <div className="card mb-4">
            <div className="card-header">Clientes Registrados</div>
            <div className="card-body p-0">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id}>
                      <td>{c.full_name}</td>
                      <td>{c.email}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={c.role}
                          onChange={(e) =>
                            handleRoleChange(c.id, e.target.value)
                          }
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gestión de Productos */}
          <div className="card mb-4">
            <div className="card-header">Gestión de Productos</div>
            <div className="card-body">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <span>
                    {p.name} — ${p.price}
                  </span>
                  <div>
                    <button className="btn btn-sm btn-warning me-2">
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger">
                      Borrar
                    </button>
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

      {/* — Botones de navegación — */}
      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Volver al Inicio
        </button>
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




