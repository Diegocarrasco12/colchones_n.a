import React, { useState } from "react";
import axios from "axios";

const ProfileImageUploader = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus("Por favor selecciona una imagen.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatus("✅ Imagen subida correctamente.");
    } catch (error) {
      console.error("❌ Error al subir imagen:", error);
      setStatus("❌ Error al subir imagen.");
    }
  };

  return (
    <div className="container my-4 text-light">
      <h4>Cambiar Foto de Perfil</h4>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleChange} className="form-control mb-2" />
        <button type="submit" className="btn btn-primary">Subir Imagen</button>
      </form>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default ProfileImageUploader;
