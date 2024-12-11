import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/globals.css';

// Rutas de inicio de sesión
import Login from './login-form';
import Register from './register-form';

// Layout que contiene el menú de administración
import Layout from './Menus/Menuadmin';
import Profile from './perfil';
import ProductoCard from './admin/eligiendo_pro';
import RecetasList from './admin/recetas';
import Categoria_recetas from './admin/categoria_recetas';
import Categoria_productos from './admin/categoria_productos';
import Productos from './admin/productos';
import VerReceta from './admin/VerReceta';

// Importando rutas de controles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  const location = useLocation();
  const token = location.state?.token;
  const tipoUsuario = location.state?.tipo_usuario;

  if (token) {
    localStorage.setItem('token', token);
  }

  if (tipoUsuario) {
    localStorage.setItem('tipo_usuario', tipoUsuario);
  }

  const tokensession = localStorage.getItem('token');
  const tipoUsuarioSession = localStorage.getItem('tipo_usuario');

  const renderRoutes = () => {
    // Si no hay token o tipo de usuario, redirige al Login
    if (!tokensession || !tipoUsuarioSession) {
      return (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register-form" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      );
    }

    // Renderizado para usuarios tipo 1 (Administrador)
    if (tipoUsuarioSession === '1') {
      return (
        <Routes>
          <Route path="/admin" element={<Layout />}>
            <Route path="categoria_recetas" element={<Categoria_recetas />} />
            <Route path="categoria_productos" element={<Categoria_productos />} />
            <Route path="eligiendo_pro" element={<ProductoCard />} />
            <Route path="productos" element={<Productos />} />
            <Route path="recetas/:categoriaId" element={<RecetasList />} />
            <Route path="recetas/:recetaId" element={<VerReceta />} />
            <Route path="perfil" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      );
    }

    // Renderizado para usuarios tipo 2 (Cliente)
    if (tipoUsuarioSession === '2') {
      return (
        <Routes>
          <Route path="/" element={<p>Bienvenido, Cliente.</p>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      );
    }

    // Caso predeterminado si el tipo de usuario no es reconocido
    return (
      <Routes>
        <Route path="/" element={<p>Tipo de usuario no reconocido.</p>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  };

  return (
    <Router>
      {renderRoutes()}
    </Router>
  );
}

export default App;
