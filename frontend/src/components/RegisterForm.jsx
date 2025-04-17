import React, { useState } from 'react';
import API_BASE_URL from '../config';
import './RegisterForm.css';
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('❌ Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (response.status !== 201) {
        throw new Error(response.data?.error || '⚠️ Error en el registro.');
      }

      setSuccessMessage(response.data.message);
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });

    } catch (error) {
      setError(`❌ Error: ${error.response?.data?.error || error.message}`);
      console.error("❌ Error en el registro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center text-light mb-4">Formulario de Registro</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow">
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Tu nombre completo" className="form-control mb-3" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Tu correo electrónico" className="form-control mb-3" required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Crea tu contraseña" className="form-control mb-3" required />
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repite tu contraseña" className="form-control mb-3" required />
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
