import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Perfil/perfil.css';
import { API_BASE_URL } from '../url';
import { px } from 'framer-motion';

function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [imgBase64, setImgBase64] = useState(null); // Guardaremos la imagen en base64
  const navigate = useNavigate();
  const id = localStorage.getItem('id'); // Obtener el id del usuario del localStorage

  useEffect(() => {
    if (!id) {
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
      navigate('/'); // Redirigir si el ID no está disponible
      return; // Salir del efecto si no hay id
    }

    // Obtener los datos del usuario desde la API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/${id}`);
        const data = await response.json();

        if (data.status === 200) {
          setUser(data.message);
          setEmail(data.message.correo);
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

    fetchUserData();
  }, [id]);

  // Función para manejar la selección y conversión de imagen a base64
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar el tipo de archivo
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, selecciona un archivo de imagen válido.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        return;
      }

      // Validar el tamaño del archivo (ejemplo: máximo 2 MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La imagen no debe superar los 2 MB.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        return;
      }

      // Convertir la imagen a base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1]; // Guardar solo la parte base64
        setImgBase64(base64);

        // Enviar la imagen al backend para actualizarla
        try {
          const response = await fetch(`${API_BASE_URL}/user/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              img: base64, // Enviamos la imagen en base64
            }),
          });

          const data = await response.json();

          if (data.status === 200) {
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'La imagen de perfil se actualizó correctamente.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
            });

            // Actualizar el estado local con la nueva imagen
            setUser((prevUser) => ({
              ...prevUser,
              img: base64,
            }));
          } else {
            throw new Error('Error al actualizar la imagen');
          }
        } catch (error) {
          console.error('Error al actualizar la imagen:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Hubo un problema al actualizar la imagen. Inténtalo nuevamente.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      };
      reader.readAsDataURL(file); // Convertir la imagen a base64
    }
  };


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
        <input id="nombre" class="swal2-input" placeholder="Nuevo nombre" value="${user.nombre || ''}">
        <input id="apellido" class="swal2-input" placeholder="Nuevo apellido" value="${user.apellido || ''}">
        <input id="carrera" class="swal2-input" placeholder="Nueva ocupación" value="${user.carrera || ''}">
        <input id="email" class="swal2-input" placeholder="Nuevo correo" value="${email}">
        <input id="password" type="password" class="swal2-input" placeholder="Nueva contraseña">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombreInput = document.getElementById('nombre').value;
        const apellidoInput = document.getElementById('apellido').value;
        const carreraInput = document.getElementById('carrera').value;
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('password').value;

        if (!nombreInput || !apellidoInput || !carreraInput || !emailInput || !passwordInput) {
          Swal.showValidationMessage('Por favor ingrese todos los campos.');
          return false;
        }

        return {
          nombre: nombreInput,
          apellido: apellidoInput,
          carrera: carreraInput,
          email: emailInput,
          password: passwordInput,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { nombre, apellido, carrera, email, password } = result.value;

        // Llamada para actualizar los datos
        const updateData = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/user/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                nombre,
                apellido,
                carrera,
                correo: email,
                clave: password,
                img: imgBase64 || user.img, // Enviamos la imagen en base64
              }),
            });

            const data = await response.json();

            if (data.status === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Usuario actualizado',
                text: 'El usuario se actualizó correctamente.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
              });
              // Actualizamos el estado con los nuevos valores
              setUser({
                ...user,
                nombre,
                apellido,
                carrera,
                img: imgBase64 || user.img, // Actualizamos la imagen si se cambió
              });
              setEmail(email);
              // Guardamos los datos actualizados en el localStorage
              localStorage.setItem('userData', JSON.stringify({ ...user, nombre, apellido, carrera, correo: email, img: imgBase64 || user.img }));
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
      {user ? (
        <>
          <div className="profile-header">
            {/* La imagen visible del usuario */}
            {user.img ? (
              <div className="card-img-container">

                <img
                  src={`data:image/png;base64,${user.img}`}
                  alt={user.nombre}
                  className="card-img-top rounded"

                />
              </div>
            ) : (
              <div className="default-img">
                <span>Sin imagen</span>
              </div>
            )}

            {/* El input para seleccionar una nueva imagen... invisible. */}
            <input
              type="file"
              id="profileImage"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }} // Ocultar el input
            />
            <label htmlFor="profileImage" className="edit-button">

              <span className="button-icon">📷 cambiar Imagen</span> 
            </label>

            <div className="profile-info">
              <span className='profile-title'><b>{user.nombre} {user.apellido}</b></span>
              <p className="profile-carrera">{user.carrera || "No se proporcionó ocupación"}</p>
              Genero:
              <p className="profile-genero">{user.genero || "No se proporciono genero"}</p>
              Email:
              <p className="profile-email">{user.correo || "No se proporciono email"}</p>

            </div>
          </div>

          <div className="profile-content">
            <div className="profile-actions">
              <button className="edit-button" onClick={handleEdit}>
                <span className="button-icon">✎  Editar</span>
              </button>
              <button className="logout-button" onClick={handleLogout}>
                <span className="button-icon">↪ Cerrar Sesión</span> 
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="loading">Cargando datos del usuario...</p>
      )}
    </div>
  );
}

export default Profile;