import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Si estás usando React Router

function UserTable() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true); // Control de acceso
  const navigate = useNavigate(); // React Router para redirigir

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await fetch('https://your-api-url.com/api/login-user'); // URL para obtener datos del usuario autenticado
        const data = await response.json();

        if (data.status === 200 && data.user.estado) {
          setIsAuthorized(true); // Usuario activo
        } else {
          setIsAuthorized(false); // Usuario inactivo
          navigate('/unauthorized'); // Redirigir si no está autorizado
        }
      } catch (error) {
        console.error('Error al verificar el estado del usuario:', error);
        setIsAuthorized(false);
        navigate('/unauthorized'); // Redirigir en caso de error
      }
    };

    fetchUserStatus();
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://your-api-url.com/api/users');
        const data = await response.json();

        if (data.status === 200) {
          setUsers(data.users);
        } else {
          console.error('Error al cargar usuarios:', data.message);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    };

    if (isAuthorized) fetchUsers(); // Solo cargar usuarios si el acceso está permitido
  }, [isAuthorized]);

  if (!isAuthorized) {
    return <h2>No tienes permiso para acceder a esta página.</h2>;
  }

  const handleStatusChange = (id, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id_usuario === id ? { ...user, estado: newStatus } : user
      )
    );
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditSave = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id_usuario === selectedUser.id_usuario ? selectedUser : user
      )
    );
    closeModal();
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
          {users.map((user) => (
            <tr key={user.id_usuario}>
              <td style={styles.td}>{user.id_usuario}</td>
              <td style={styles.td}>{user.correo}</td>
              <td style={styles.td}>{user.estado ? 'Activo' : 'Inactivo'}</td>
              <td style={styles.td}>
                <button
                  style={{ ...styles.button, ...styles.changeStatusButton }}
                  onClick={() => handleStatusChange(user.id_usuario, !user.estado)}
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
          ))}
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

export default UserTable;
