import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/globals.css';
import Swal from 'sweetalert2'; // Import SweetAlert2

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
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './url';


function App() {
  
  const location = useLocation();
  const token = location.state?.token;
  const tipoUsuario = location.state?.tipo_usuario;
  const navigate = useNavigate();
  const id = localStorage.getItem('id');
  const [isLoggedOut, setIsLoggedOut] = useState(false);


  


  if (token) localStorage.setItem('token', token);
  if (tipoUsuario) localStorage.setItem('tipo_usuario', tipoUsuario);

  const tokensession = localStorage.getItem('token');
  const tipoUsuarioSession = localStorage.getItem('tipo_usuario');
  function showConfirmation() {
    const sessionDuration = 15 * 60 * 1000; // Ejemplo: 15 minutos en milisegundos
    const sessionEndTime = new Date().getTime() + sessionDuration;
    let autoLogoutTimeout;
  
    function calculateRemainingTime() {
      const now = new Date().getTime();
      return Math.max(0, sessionEndTime - now); // Tiempo restante en milisegundos
    }
  
    Swal.fire({
      title: 'Extender la sesión',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      timer: calculateRemainingTime(),
      timerProgressBar: true,
    }).then((result) => {
      clearTimeout(autoLogoutTimeout);
  
      if (result.isConfirmed) {
        startTimeout();
      } else if (result.isDismissed) {
        performLogout();
      }
    });
  
    autoLogoutTimeout = setTimeout(() => {
      Swal.close();
      performLogout();
    }, calculateRemainingTime());
  }
  
  function startTimeout() {
    setTimeout(() => {
      showConfirmation();
    }, 60000); // Vuelve a mostrar el modal después de 1 minuto
  }
  
  async function performLogout() {
    try {
      const response = await fetch(`${API_BASE_URL}/logout/${id}`);
      const data = await response.json();
  
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
  
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cerrar sesión. Inténtalo nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  }
  
  
  


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
      startTimeout();

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