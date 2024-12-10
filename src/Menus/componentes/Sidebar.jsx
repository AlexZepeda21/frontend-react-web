import React, { useState } from 'react';
import "../../styles/Menuadmin/Siderbar.css";
import logo from '../../img/image.png';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';


Modal.setAppElement('#root'); // Asegúrate de que el ID del elemento raíz sea correcto

function Sidebar() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleLogout = () => {
    // Lógica para cerrar sesión
    localStorage.removeItem('userToken'); // Eliminar token del almacenamiento local
    closeModal(); // Cerrar el modal
    navigate('/'); // Redirigir al usuario a la página principal o inicio de sesión
  };

  return (
    <>
      <aside className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="ITCA FEPADE" className="logo" />
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
          {/* Botón para abrir el modal de cerrar sesión */}
          <button onClick={openModal} className="nav-item btn-logout">
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

      {/* Modal de Confirmación */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content mx-auto max-w-md rounded-lg bg-white shadow-lg p-6"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h1 className="text-xl font-bold text-center mb-4">¿Deseas cerrar sesión?</h1>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sí, cerrar sesión
          </button>
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Sidebar;
