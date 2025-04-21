import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  // Inyectar token en axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Cargar perfil al iniciar o cuando cambia token
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("No se pudo obtener el perfil");
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("❌ Error al obtener el perfil:", error);
        logout();
      }
    };
    if (token) fetchProfile();
  }, [token]);

  // Sincronizar carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Login
  const login = async (email, password) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error en login");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error("❌ Error en login:", error.message);
      return false;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // Carrito
  const addToCart = (product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateUser,     // <-- lo exponemos aquí
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

