import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const apiURL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const { user, logout, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Vista previa de la imagen y posibles errores
  const [preview, setPreview] = useState("/img/default_avatar.png");
  const [error, setError] = useState("");

  // Datos de admin: clientes y productos
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  // Carga inicial de perfil, clientes y productos
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.profileImage) {
      setPreview(`${apiURL}/${user.profileImage}`);
    }
    if (user.role === "admin") {
      axios
        .get(`${apiURL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setClients(res.data))
        .catch(console.error);

      axios
        .get(`${apiURL}/api/products`)
        .then((res) => setProducts(res.data))
        .catch(console.error);
    }
  }, [user, navigate, token]);

  // — Subida de foto de perfil —
  const handleImageClick = () => fileInputRef.current.click();
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.put(
        `${apiURL}/api/auth/profile-image`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Persistir ruta en contexto y localStorage
      const { imagePath } = res.data;
      updateUser({ ...user, profileImage: imagePath });

      setPreview(URL.createObjectURL(file));
      setError("");
    } catch (err) {
      console.error("❌ Error al subir imagen:", err.response || err);
      setError("Error al subir imagen.");
    }
  };

  // — CRUD PRODUCTOS para admin —
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("¿Borrar este producto?")) return;
    try {
      await axios.delete(
        `${apiURL}/api/admin/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("❌ Error al borrar producto:", err.response || err);
    }
  };

  const handleEditProduct = async (product) => {
    const newName = window.prompt("Nuevo nombre:", product.name);
    if (newName == null) return;
    const newPriceStr = window.prompt("Nuevo precio:", product.price);
    if (newPriceStr == null) return;
    const newPrice = Number(newPriceStr);
    try {
      await axios.put(
        `${apiURL}/api/admin/products/${product.id}`,
        { name: newName, price: newPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, name: newName, price: newPrice } : p
        )
      );
    } catch (err) {
      console.error("❌ Error al editar producto:", err.response || err);
    }
  };

  const handleAddProduct = async () => {
    const name = window.prompt("Nombre del nuevo producto:");
    if (!name) return;
    const priceStr = window.prompt("Precio del nuevo producto:");
    if (priceStr == null) return;
    const price = Number(priceStr);
    try {
      const res = await axios.post(
        `${apiURL}/api/admin/products`,
        { name, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("❌ Error al agregar producto:", err.response || err);
    }
  };

  if (!user) return null;

  return (
    <div className="container mt-5 text-light">
      <h2 className="text-center">Perfil de {user.fullName || user.name}</h2>
      <p className="text-center">
        <strong>Email:</strong> {user.email}
      </p>

      {/* Foto de perfil clicable */}
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

      {/* Sección ADMIN */}
      {user.role === "admin" && (
        <>
          {/* Clientes Registrados */}
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
                            axios
                              .put(
                                `${apiURL}/api/admin/users/${c.id}/role`,
                                { role: e.target.value },
                                { headers: { Authorization: `Bearer ${token}` } }
                              )
                              .then(() =>
                                setClients((prev) =>
                                  prev.map((u) =>
                                    u.id === c.id
                                      ? { ...u, role: e.target.value }
                                      : u
                                  )
                                )
                              )
                              .catch(console.error)
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
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditProduct(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteProduct(p.id)}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="btn btn-sm btn-success"
                onClick={handleAddProduct}
              >
                Agregar Nuevo Producto
              </button>
            </div>
          </div>
        </>
      )}

      {/* Botones de navegación */}
      <div className="d-flex justify-content-center gap-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/")}
        >
          Volver al Inicio
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/profile")}
        >
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






