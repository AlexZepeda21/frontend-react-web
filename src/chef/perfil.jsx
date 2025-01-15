import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Perfil/perfil.css';
import { API_BASE_URL } from '../url';

function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const id = localStorage.getItem('id'); // Obtener el id del usuario del localStorage

  useEffect(() => {
    // Obtener los datos del usuario desde la API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/${id}`);
        const data = await response.json();

        if (data.status === 200) {
          setUser(data.message);
          setEmail(data.message.correo);  // Establecer el correo en el estado
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cargar los datos del usuario.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Hubo un problema al obtener los datos. Inténtalo nuevamente.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    };

    if (id) {
      fetchUserData();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha encontrado el ID del usuario.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }, [id]);

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres cerrar sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#CD853F',
      cancelButtonColor: '#8b2323',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const fetchLogout = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/logout/${id}`);
            const data = await response.json();

            if (data.status === 200) {
              Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Sesión cerrada con éxito',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                localStorage.clear();
                navigate('/'); // Redirigir al usuario
              });
            } else {
              throw new Error('Error al cerrar sesión');
            }
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.message || 'Hubo un problema al cerrar sesión. Inténtalo nuevamente.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          }
        };

        fetchLogout();
      }
    });
  };

  const handleEdit = () => {
    Swal.fire({
      title: 'Editar Datos',
      html: `
        <input id="email" class="swal2-input" placeholder="Nuevo correo" value="${email}">
        <input id="password" type="password" class="swal2-input" placeholder="Nueva contraseña">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('password').value;

        if (!emailInput || !passwordInput) {
          Swal.showValidationMessage('Por favor ingrese todos los campos.');
          return false;
        }

        return { email: emailInput, password: passwordInput };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { email, password } = result.value;

        // Llamada para actualizar los datos
        const updateData = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/user/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                correo: email,
                clave: password,
              }),
            });

            const data = await response.json();

            if (data.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Usuario actualizado",
                text: "El usuario se actualizó correctamente.",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500,
              });
              setEmail(email);  // Actualizar el estado con el nuevo correo
              localStorage.setItem('userData', JSON.stringify({ ...user, correo: email }));
            } else {
              throw new Error('Error al actualizar los datos');
            }
          } catch (error) {
            console.error('Error al actualizar los datos:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.message || 'Hubo un problema al actualizar los datos. Inténtalo nuevamente.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          }
        };

        updateData();
      }
    });
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Mi Perfil</h1>
      <div className="profile-content">
        {user ? (
          <>
            <h2 className="profile-email">{email}</h2>
            <div className="profile-actions">
              <button className="edit-button" onClick={handleEdit}>
                <span className="button-icon">✎</span>
                Editar
              </button>
              <button className="logout-button" onClick={handleLogout}>
                <span className="button-icon">↪</span>
                Cerrar Sesión
              </button>
            </div>
          </>
        ) : (
          <p>Cargando datos del usuario...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
