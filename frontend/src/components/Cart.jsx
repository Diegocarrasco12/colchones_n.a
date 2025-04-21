import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useAuth();
  const navigate = useNavigate();
  const [showBankDetails, setShowBankDetails] = useState(false);

  // 1. Calcular total
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="container mt-5 text-light">
      <h2>Carrito de Compras</h2>

      {/* Lista de productos */}
      <ul className="list-group mb-3">
        {cart.map((item, idx) => (
          <li
            key={idx}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {item.name} — ${item.price}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => removeFromCart(item.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* Total y botones de acción */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Total: ${total}</h5>
        <div>
          <button className="btn btn-warning me-2" onClick={clearCart}>
            Vaciar Carrito
          </button>
          <button
            className="btn btn-success"
            onClick={() => setShowBankDetails(true)}
          >
            Continuar con la compra
          </button>
        </div>
      </div>

      {/* 2. Sección de cuenta bancaria */}
      {showBankDetails && (
        <div className="card bg-dark text-white p-4 mb-5">
          <h4>Datos Bancarios para Transferencia</h4>
          <p>
            <strong>Banco:</strong> Banco Falabella
          </p>
          <p>
            <strong>Tipo de cuenta:</strong> Cuenta Vista
          </p>
          <p>
            <strong>Nombre Titular:</strong> Nancy Angulo
          </p>
          <p>
            <strong>Número de cuenta:</strong> 5-546-002401-8
          </p>
          <p>
            <strong>RUT:</strong> 14.183.202-6
          </p>
          <p className="mt-3">
            Una vez realizada la transferencia, por favor envía el comprobante
            al WhatsApp +56 9 8978 5828, email nancy_mariluz@hotmail.cl o rellenando el formulario de contacto.
          </p>
        </div>
      )}
    </div>
  );
};

export default Cart;
