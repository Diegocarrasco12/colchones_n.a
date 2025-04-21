import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

// Lazy loading de páginas/componentes
const MainContent    = lazy(() => import("./components/MainContent"));
const ContactForm    = lazy(() => import("./components/ContactForm"));
const ProductGallery = lazy(() => import("./components/ProductGallery"));
const RegisterForm   = lazy(() => import("./components/RegisterForm"));
const LoginForm      = lazy(() => import("./components/LoginForm"));
const ProductDetail  = lazy(() => import("./components/ProductDetail"));
const AdminProducts  = lazy(() => import("./components/AdminProducts"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const Cart           = lazy(() => import("./components/Cart"));

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Aquí usamos la clase .app-container */}
        <div className="app-container">
          <Header />

          {/* Y este main debe llevar .main-content */}
          <main className="main-content">
            <Suspense fallback={<div className="loading">Cargando...</div>}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <MainContent />
                      <ProductGallery />
                    </>
                  }
                />
                <Route path="/productos" element={<ProductGallery />} />
                <Route path="/contacto" element={<ContactForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />

                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin/products"
                  element={
                    <PrivateRoute>
                      <AdminProducts />
                    </PrivateRoute>
                  }
                />

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
