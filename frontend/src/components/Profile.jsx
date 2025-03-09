import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // ✅ Si el usuario no está autenticado, redirigir al login
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mt-5">
      <h2>Perfil de {user.fullName || user.name || "Usuario"}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <button className="btn btn-danger" onClick={() => { logout(); navigate("/"); }}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Profile;
