import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../url';
import Swal from 'sweetalert2'; // Para mostrar mensajes de éxito/error

function UserTableChef() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user`);
        const data = await response.json();

        if (data.status === 200 && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          console.error('Error al cargar usuarios:', data.message);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id_usuario === id ? { ...user, estado: newStatus } : user
          )
        );
        Swal.fire({
          icon: 'success',
          title: 'Estado actualizado',
          text: `El usuario ha sido ${newStatus ? 'activado' : 'desactivado'}.`,
        });
      } else {
        console.error('Error al cambiar el estado del usuario');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${selectedUser.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: selectedUser.correo }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id_usuario === selectedUser.id_usuario ? selectedUser : user
          )
        );
        closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: 'El correo del usuario ha sido actualizado correctamente.',
        });
      } else {
        const errorData = await response.json();
        console.error('Error al guardar los cambios del usuario:', errorData);
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'No se pudo actualizar el usuario. Intente nuevamente.',
        });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar los cambios del usuario.',
      });
    }
  };
  

  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    th: {
      border: '1px solid #ccc',
      padding: '10px',
      backgroundColor: '#f4f4f4',
      textAlign: 'left',
    },
    td: {
      border: '1px solid #ccc',
      padding: '10px',
      textAlign: 'left',
    },
    button: {
      padding: '5px 10px',
      margin: '0 5px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      color: '#fff',
    },
    changeStatusButton: {
      backgroundColor: '#007bff',
    },
    editButton: {
      backgroundColor: '#ffc107',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      width: '400px',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
  };

  return (
    <div>
      <h2>Usuarios Registrados</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Correo Electrónico</th>
            <th style={styles.th}>Estado</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id_usuario}>
                <td style={styles.td}>{user.id_usuario}</td>
                <td style={styles.td}>{user.correo}</td>
                <td style={styles.td}>{user.estado ? 'Activo' : 'Inactivo'}</td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.button, ...styles.changeStatusButton }}
                    onClick={() =>
                      handleStatusChange(user.id_usuario, !user.estado)
                    }
                  >
                    {user.estado ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.editButton }}
                    onClick={() => openModal(user)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                No hay usuarios disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Editar Usuario</h3>
            <input
              style={styles.input}
              type="text"
              value={selectedUser.correo}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, correo: e.target.value })
              }
              placeholder="Correo Electrónico"
            />
            <button
              style={{ ...styles.button, ...styles.changeStatusButton }}
              onClick={handleEditSave}
            >
              Guardar
            </button>
            <button
              style={{ ...styles.button, ...styles.editButton }}
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTableChef;
