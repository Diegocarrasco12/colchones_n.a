import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState("/img/default_avatar.png");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");

    if (user?.profileImage) {
      setPreview(`${import.meta.env.VITE_API_BASE_URL}/${user.profileImage}`);
    }
  }, [user, navigate]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPreview(URL.createObjectURL(file));
      setError("");
    } catch (err) {
      console.error("❌ Error al subir imagen:", err);
      setError("Error al subir imagen.");
    }
  };

  if (!user) return null;

  return (
    <div className="container mt-5 text-light text-center">
      <h2>Perfil de {user.fullName || user.name}</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <div className="mt-4">
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

      <button className="btn btn-danger mt-4" onClick={() => { logout(); navigate("/"); }}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Profile;
