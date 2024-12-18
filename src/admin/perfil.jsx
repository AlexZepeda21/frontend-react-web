import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';  // Importa SweetAlert2
import '../styles/Perfil/perfil.css';
import { API_BASE_URL } from '../url';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const id = localStorage.getItem('id'); // Obtener el id del usuario del localStorage

  useEffect(() => {
    // Simular obtención de datos del usuario desde el localStorage o API
    const userData = JSON.parse(localStorage.getItem('userData')) || {
      name: 'nombre',
      email: 'usuario@correo.com'
    };
    setUser(userData);
  }, []);

  const handleLogout = () => {
    // Usar SweetAlert2 para confirmar la acción de cerrar sesión
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres cerrar sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#CD853F',  // Color #CD853F para el botón de confirmar
      cancelButtonColor: '#8b2323',  // Color #8b2323 para el botón de cancelar
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, proceder con el logout
        const fetchLogout = async () => {
          try {
            // Simulación de una solicitud de cierre de sesión (por ejemplo, un endpoint de logout en el backend)
            const response = await fetch(`${API_BASE_URL}/logout/${id}`);
            const data = await response.json();

            // Usar SweetAlert2 para mostrar un mensaje de éxito
            Swal.fire({
              title: '¡Éxito!',
              text: 'Sesión cerrada con éxito',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              // Limpiar el localStorage
              localStorage.clear();
              navigate('/'); // Redirigir al usuario a la página principal o inicio de sesión
            });
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

        fetchLogout();  // Ejecutar el cierre de sesión
      }
    });
  };

  const correo = localStorage.getItem("correo");

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="profile-container">
        <div className="profile-banner"></div>
        <div className="profile-content">
          <div className="profile-avatar">
            <img
              src="https://via.placeholder.com/150"
              alt="Foto de perfil"
              className="avatar-image"
            />
          </div>
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-email">{correo}</p>
          <div className="profile-actions">
            <button className="edit-button">
              <span className="button-icon">✎</span>
              Editar
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <span className="button-icon">↪</span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
