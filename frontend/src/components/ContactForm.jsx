import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/contact`, formData);
      if (response.status === 200) {
        setSuccess("✅ Tu mensaje ha sido enviado correctamente.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setError("❌ Hubo un error al enviar tu mensaje.");
      }
    } catch (err) {
      console.error("❌ Error al enviar formulario:", err);
      setError("❌ No se pudo enviar tu mensaje. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-light">
      <h2 className="text-center mb-4">Contáctanos</h2>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow mx-auto" style={{ maxWidth: "600px" }}>
        <div className="mb-3">
          <label className="form-label">Nombre:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo Electrónico:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Tu correo electrónico"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mensaje:</label>
          <textarea
            className="form-control"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tu mensaje"
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
