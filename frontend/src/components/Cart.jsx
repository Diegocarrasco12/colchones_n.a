import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useAuth();

  return (
    <div className="container mt-5">
      <h2>Carrito de Compras</h2>
      {cart.length === 0 ? <p>El carrito está vacío.</p> : (
        <>
          <ul className="list-group">
            {cart.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {item.name} - ${item.price}
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <button className="btn btn-warning mt-3" onClick={clearCart}>Vaciar Carrito</button>
        </>
      )}
    </div>
  );
};

export default Cart;

