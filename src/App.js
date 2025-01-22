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
import Registro from './admin/registro';
import UserTable from './admin/usuario';
import UnidadMedidaList from './admin/uni_medidas';
import VerReceta from './admin/VerReceta';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './url';
import Subir_img from './QR/Subir_img';
import Menu from './admin/Menu';
import Platos from './admin/Platos';
import Reservas from './admin/Reservas';
import Dashboard from './admin/dashboard';
import { time } from 'framer-motion';

// Componentes chef
import LayoutChef from './Menus/Menuchef';
import ProfileChef from './chef/perfil';
import ProductoCardChef from './chef/eligiendo_pro';
import RecetasListChef from './chef/recetas';
import Categoria_recetasChef from './chef/categoria_recetas';
import Categoria_productosChef from './chef/categoria_productos';
import ProductosChef from './chef/productos';
import RegistroChef from './chef/registro';
import UserTableChef from './chef/prueba';
import UnidadMedidaListChef from './chef/uni_medidas';
import VerRecetaChef from './chef/VerReceta';
import MenuChef from './chef/Menu';
import PlatosChef from './chef/Platos';
import ReservasChef from './chef/Reservas'
import DashboardChef from './chef/dashboard';
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
    const sessionDuration = 15 * 60 * 1000;
    const sessionEndTime = new Date().getTime() + sessionDuration;






    function calculateRemainingTime() {
      const now = new Date().getTime();
      return Math.max(0, sessionEndTime - now);
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
      if (result.isConfirmed) {
        startTimeout();
      } else if (result.isDismissed) {
        performLogout();
      }
    });


    setTimeout(() => {
      Swal.close();
      performLogout();
    }, calculateRemainingTime());



  }
  let timeoutScheduled = false;
  let warning = false;


  function startTimeout() {
    
    if (!timeoutScheduled) {  
      timeoutScheduled = true;
        setTimeout(() => {
        showConfirmation();
      }, 10 * 60 * 1000);
    }
  }


  function resetTimer() {
    startTimeout();
  }

  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  window.addEventListener("click", resetTimer);
  window.addEventListener("scroll", resetTimer);

  async function performLogout() {
    try {

      if(!warning){
        warning = true;

      const response = await fetch(`${API_BASE_URL}/logout/${id}`);
      const data = await response.json();

      localStorage.clear();
      navigate('/');
      Swal.fire({
        title: 'Informacion',
        text: 'Se cerro su session por inactividad.',
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
    }else{
      localStorage.clear();
    }

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

  function detectarDispositivo() {
    const userAgent = navigator.userAgent.toLowerCase();
    const anchoPantalla = window.screen.width;
    const altoPantalla = window.screen.height;
    const ratioPixel = window.devicePixelRatio || 1;

    if (/tablet|ipad|playbook|silk/.test(userAgent)) {
      return "Tablet";
    }

    if (/mobile|android|iphone|ipod/.test(userAgent)) {
      if (Math.max(anchoPantalla, altoPantalla) >= 900) {
        return "Tablet";
      }
      return "Teléfono";
    }

    if (Math.max(anchoPantalla, altoPantalla) <= 1280 && Math.min(anchoPantalla, altoPantalla) >= 600) {
      return "Tablet";
    }

    return "PC";
  }






  //localStorage.clear();

  const renderRoutes = () => {


    if (detectarDispositivo() === "Teléfono") {
      return (
        <Routes>
          <Route path="/QR" element={<Subir_img />} />
        </Routes>

      );
    }




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
            <Route path="uni_medidas" element={<UnidadMedidaList />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="recetas/:categoriaId" element={<RecetasList />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="registro" element={<Registro />} />
            <Route path="usuario" element={<UserTable />} />
            <Route path="Menu" element={<Menu />} />
            <Route path="Platos/:id_categoria_menu" element={<Platos />} />
            <Route path="Reservas" element={<Reservas />} />
            <Route path="VerReceta/:idReceta" element={<VerReceta />} />


          </Route>
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      );
    }

    if (tipoUsuarioSession === '2') {
      return (
        <Routes>
          <Route path="/chef" element={<LayoutChef />}>
            <Route path="categoria_recetas" element={<Categoria_recetasChef />} />
            <Route path="categoria_productos" element={<Categoria_productosChef />} />
            <Route path="eligiendo_pro" element={<ProductoCardChef />} />
            <Route path="productos" element={<ProductosChef />} />
            <Route path="uni_medidas" element={<UnidadMedidaListChef />} />
            <Route path="recetas/:categoriaId" element={<RecetasListChef />} />
            <Route path="perfil" element={<ProfileChef />} />
            <Route path="Menu" element={<MenuChef />} />
            <Route path="VerReceta/:idReceta" element={<VerRecetaChef />} />
            <Route path="Reservas" element={<ReservasChef />} />
            <Route path="Platos/:id_categoria_menu" element={<PlatosChef />} />
            <Route path="dashboard" element={<DashboardChef />} />



          </Route>
          <Route path="*" element={<Navigate to="/chef" />} />
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