import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Lazy loading
const MainContent = lazy(() => import("./components/MainContent"));
const ContactForm = lazy(() => import("./components/ContactForm"));
const ProductGallery = lazy(() => import("./components/ProductGallery"));
const RegisterForm = lazy(() => import("./components/RegisterForm"));
const LoginForm = lazy(() => import("./components/LoginForm"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const AdminProducts = lazy(() => import("./components/AdminProducts"));
const Cart = lazy(() => import("./components/Cart"));

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main>
            <Suspense fallback={<div className="loading">Cargando...</div>}>
              <Routes>
                {/* ✅ Pantalla de inicio con el compromiso de la empresa */}
                <Route path="/" element={
                  <>
                    <MainContent />
                    <ProductGallery />
                  </>
                } />

                {/* ✅ Rutas públicas */}
                <Route path="/productos" element={<ProductGallery />} />
                <Route path="/contacto" element={<ContactForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />

                {/* ✅ Ruta protegida de perfil */}
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />

                {/* ✅ Rutas protegidas de administrador */}
                <Route path="/admin/products" element={
                  <PrivateRoute>
                    <AdminProducts />
                  </PrivateRoute>
                } />

                {/* ✅ Manejamos error 404 */}
                <Route path="*" element={<h2>Página no encontrada</h2>} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;


