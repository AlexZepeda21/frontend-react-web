import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simular obtención de datos del usuario desde el localStorage o API
    const userData = JSON.parse(localStorage.getItem('userData')) || {
      name: 'Juan Pérez',
      email: 'juan.perez@ejemplo.com',
      phone: '123-456-7890',
      address: 'Calle Falsa 123',
    };
    setUser(userData);
    setName(userData.name);
    setEmail(userData.email);
    setPhone(userData.phone);
    setAddress(userData.address);
  }, []);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const handleSave = () => {
    const updatedUser = { ...user, name, email, phone, address };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser)); // Guardar cambios
    closeEditModal();
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Eliminar token del almacenamiento local
    navigate('/'); // Redirigir a la página de inicio de sesión
  };
  const styles = {
    page: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between', // Espaciado entre el contenido y el formulario
    },
    headerTitle: {
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    profileContainer: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      flex: 1, // Toma todo el espacio disponible a la izquierda
    },
    userDetails: {
      textAlign: 'center',
      marginTop: '10px',
    },
    actions: {
      textAlign: 'center',
      marginTop: '20px',
    },
    button: {
      padding: '10px 20px',
      margin: '5px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
    },
    editButton: {
      backgroundColor: '#007bff',
      color: '#fff',
    },
    logoutButton: {
      backgroundColor: '#dc3545',
      color: '#fff',
    },
    editSection: {
      flexBasis: '30%', // El formulario ocupa el 30% del espacio
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      alignSelf: 'flex-start', // Se alinea al inicio de la página
    },
    formGroup: {
      marginBottom: '15px',
    },
    input: {
      width: '100%',
      padding: '8px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
  };
  
  
  return (
    <div style={styles.page}>
      {/* Encabezado principal */}
      <h2 style={styles.headerTitle}>Perfil</h2>
  
      {/* Contenedor de la imagen y detalles del usuario */}
      <div style={styles.profileContainer}>
        <img
          src="https://via.placeholder.com/150"
          alt="Foto de perfil"
          style={styles.avatar}
        />
        <div style={styles.userDetails}>
          <h1 style={styles.name}>{user?.name}</h1>
          <p style={styles.email}>{user?.email}</p>
        </div>
      </div>
  
      {/* Botones */}
      <div style={styles.actions}>
        <button
          onClick={() => setEditModalOpen(!isEditModalOpen)}
          style={{ ...styles.button, ...styles.editButton }}
        >
          {isEditModalOpen ? "Cerrar Edición" : "Editar Perfil"}
        </button>
        <button
          onClick={handleLogout}
          style={{ ...styles.button, ...styles.logoutButton }}
        >
          Cerrar Sesión
        </button>
      </div>
  
      {/* Formulario Inline para editar perfil */}
      {isEditModalOpen && (
        <div style={styles.editSection}>
          <h2 className="text-center">Editar Perfil</h2>
          <div style={styles.formGroup}>
            <label>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Teléfono</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Dirección</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.modalActions}>
            <button
              onClick={handleSave}
              style={{ ...styles.button, ...styles.editButton }}
            >
              Guardar
            </button>
            <button
              onClick={() => setEditModalOpen(false)}
              style={{ ...styles.button, ...styles.logoutButton }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  
  
}

export default Profile;
