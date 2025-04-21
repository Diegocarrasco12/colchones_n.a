import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileImageUploader from "./ProfileImageUploader";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mt-5 text-light">
      <h2>Perfil de {user.fullName || user.name || "Usuario"}</h2>
      <p><strong>Email:</strong> {user.email}</p>

      {/* Mostrar imagen de perfil si existe */}
      {user.profile_image && (
        <div className="mb-3">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/${user.profile_image}`}
            alt="Foto de perfil"
            style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Solo si es admin, mostrar el formulario para subir imagen */}
      {user.role === "admin" && <ProfileImageUploader />}

      <button
        className="btn btn-danger mt-4"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Profile;
