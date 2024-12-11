import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';  // Importa SweetAlert2
import '../styles/Perfil/perfil.css';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simular obtención de datos del usuario desde el localStorage o API
    const userData = JSON.parse(localStorage.getItem('userData')) || {
      name: 'nombre',
      email: 'usuario@correo.com'
    };
    setUser(userData);
  }, []);

  const handleLogout = () => {
    // Mostrar SweetAlert2 antes de cerrar sesión
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
        // Si el usuario confirma, eliminamos el token y redirigimos
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData'); // Opcional: eliminar los datos del usuario también
        navigate('/'); // Redirigir a la página de inicio
      }
    });
  };

  return (
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
        <p className="profile-email">{user?.email}</p>
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
  );
}

export default Profile;