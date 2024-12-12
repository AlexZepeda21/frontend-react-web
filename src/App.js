import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/globals.css';

// Componentes
import Login from './login-form';
import Register from './register-form';
import Layout from './Menus/Menuadmin';
import Profile from './admin/perfil';
import ProductoCard from './admin/eligiendo_pro';
import RecetasList from './admin/recetas';
import Categoria_recetas from './admin/categoria_recetas';
import Categoria_productos from './admin/categoria_productos';
import Productos from './admin/productos';
import UserTable from './admin/usuario';
import VerReceta from './admin/VerReceta';


function App() {
  const location = useLocation();
  const token = location.state?.token;
  const tipoUsuario = location.state?.tipo_usuario;

  if (token) localStorage.setItem('token', token);
  if (tipoUsuario) localStorage.setItem('tipo_usuario', tipoUsuario);

  const tokensession = localStorage.getItem('token');
  const tipoUsuarioSession = localStorage.getItem('tipo_usuario');

  //localStorage.clear();

  const renderRoutes = () => {
    if (!tokensession || !tipoUsuarioSession) {
      return (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register-form" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      );
    }

    if (tipoUsuarioSession === '1') {
      return (
        <Routes>
          <Route path="/admin" element={<Layout />}>
            <Route path="categoria_recetas" element={<Categoria_recetas />} />
            <Route path="categoria_productos" element={<Categoria_productos />} />
            <Route path="eligiendo_pro" element={<ProductoCard />} />
            <Route path="productos" element={<Productos />} />
            <Route path="recetas/:categoriaId" element={<RecetasList />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="usuario" element={<UserTable />} />
            <Route path="VerReceta/:idReceta" element={<VerReceta />} />

            
          </Route>
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      );
    }

    if (tipoUsuarioSession === '2') {
      return (
        <Routes>
          <Route path="/" element={<p>Bienvenido, Cliente.</p>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      );
    }

    return (
      <Routes>
        <Route path="/" element={<p>Tipo de usuario no reconocido.</p>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  };

  return <div>{renderRoutes()}</div>;
}

export default App;