import React, { useState, useEffect } from 'react';
import "../../styles/Menuadmin/Siderbar.css";
import logo from '../../img/logo.png';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../url';
import Swal from 'sweetalert2'; // Importa SweetAlert2

function Sidebar() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const navigate = useNavigate();
  const id = localStorage.getItem('id'); // Obtener el id de usuario del localStorage

  const handleLogout = () => {
    // Usar SweetAlert2 para confirmar la acción de cerrar sesión
    Swal.fire({
      title: '¿Deseas cerrar sesión?',
      text: 'Puedes volver cuando lo desees.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, proceder con el logout
        setIsLoggedOut(true); // Cambia el estado de cierre de sesión
      }
    });
  };

  useEffect(() => {
    if (isLoggedOut) {
      const fetchLogout = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/logout/${id}`);
          const data = await response.json();

          if (response.ok && data.status === 200) {
            // Usar SweetAlert2 para mostrar un mensaje de éxito como toast
            Swal.fire({
              icon: 'success',
              title: 'Sesión cerrada con éxito',
              toast: true,           // Notificación tipo toast
              position: 'top-end',
              showConfirmButton: false,
              timer: 1000,           // Duración de la notificación en milisegundos
            }).then(() => {
              localStorage.clear();
              navigate('/'); // Redirigir al usuario a la página principal o inicio de sesión
            });
          }
        } catch (error) {
          console.error('Error al cerrar sesión:', error);

          // Usar SweetAlert2 para mostrar un mensaje de error
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al cerrar sesión. Inténtalo nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      };

      fetchLogout();
    }
  }, [isLoggedOut, id]); // Se ejecuta cuando isLoggedOut cambia

  return (
    <>
      <aside className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="ITCA FEPADE" className="logo" />
        </div>
        <nav className="main-nav">
        <a href="/../admin/por_Vencer" className="nav-item">
            <i className="fas fa-tachometer-alt"></i>Dashboard
          </a>
          <a href="/../admin/dashboard" className="nav-item">
            <i className="fas fa-tachometer-alt"></i>Graficos
          </a>
          <a href="/../admin/categoria_productos" className="nav-item">
            <i className="fas fa-th-large"></i>Categorías
          </a>
          <a href="/../admin/uni_medidas" className="nav-item">
            <i className="fas fa-balance-scale"></i>Unidades Medida
          </a>
          <a href="/../admin/Fechas" className="nav-item">
            <i className="fas fa-box"></i>Fechas
          </a>
          <a href="/../admin/categoria_recetas" className="nav-item">
            <i className="fas fa-utensils"></i>Recetas
          </a>
          <a href="/../admin/Menu" className="nav-item">
            <i className="fas fa-concierge-bell"></i>Menu
          </a>
          <a href="../admin/Reservas" className="nav-item">
            <i className="fas fa-calendar-check"></i>Reservas
          </a>
          <a href="../admin/usuario" className="nav-item">
            <i className="fas fa-users"></i>Usuarios
          </a>
          <a href="../admin/perfil" className="nav-item">
            <i className="fas fa-user"></i>Ver Perfil
          </a>
          {/* Botón para cerrar sesión usando SweetAlert */}
          <button onClick={handleLogout} className="nav-item btn-logout">
            <i className="fas fa-sign-out-alt"></i>Cerrar Sesión
          </button>
        </nav>
        <div className="reports-panel">
          <h3 className="panel-title">PANEL DE REPORTES</h3>
          <nav className="reports-nav">
            <a href="#" className="nav-item">
              <i className="fas fa-history"></i>Historial Productos
            </a>
            <a href="#" className="nav-item">
              <i className="fas fa-chart-line"></i>Historial Ingresos
            </a>
            <a href="#" className="nav-item">
              <i className="fas fa-book"></i>Historial Recetas
            </a>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
