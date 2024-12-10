import React from 'react';
import "../../styles/Menuadmin/Siderbar.css";
import logo from '../../img/logo.png';


function Sidebar() {
    return (
      <aside className="sidebar">
        <div className="logo-container">
         <img src={logo} alt="ITCA FEPADE" className="logo" />;
        </div>
        <nav className="main-nav">
          <a href="#" className="nav-item">
            <i className="fas fa-tachometer-alt"></i>Dashboard
          </a>
          <a href="/../admin/categoria_productos" className="nav-item">
            <i className="fas fa-th-large"></i>Categorías
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-box"></i>Productos
          </a>
          <a href="/../admin/categoria_recetas" className="nav-item">
            <i className="fas fa-utensils"></i>Recetas
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-concierge-bell"></i>Menu
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-calendar-check"></i>Reservas
          </a>
          <a href="../../register-form.jsx" className="nav-item">
            <i className="fas fa-users"></i>Usuarios
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-user"></i>Ver Perfil
          </a>
          <a href="#" className="nav-item">
            <i className="fas fa-sign-out-alt"></i>Cerrar Sesión
          </a>
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
    );
  }
  


export default Sidebar;
