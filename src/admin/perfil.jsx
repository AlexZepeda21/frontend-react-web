import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [user, setUser] = useState({});
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    setUser(userData);
    setName(userData.name || 'Invitado');
    setEmail(userData.email || '');
    setPhone(userData.phone || '');
    setAddress(userData.address || '');
  }, []);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const handleSave = () => {
    const updatedUser = { name, email, phone, address };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    closeEditModal();
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const styles = {
    page: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    profileContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
    },
    avatar: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      marginBottom: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    userDetails: {
      textAlign: 'center',
    },
    actions: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s ease',
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
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      width: '350px',
      textAlign: 'left',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '10px',
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
      <h2 style={styles.headerTitle}>Perfil</h2>
      <div style={styles.profileContainer}>
        <img
          src="https://via.placeholder.com/150"
          alt="Foto de perfil"
          style={styles.avatar}
        />
        <div style={styles.userDetails}>
          <h3>{user?.name || 'Invitado'}</h3>
          <p>{user?.email || 'Correo no disponible'}</p>
        </div>
      </div>
      <div style={styles.actions}>
        <button
          onClick={openEditModal}
          style={{ ...styles.button, ...styles.editButton }}
        >
          Editar Perfil
        </button>
        <button
          onClick={handleLogout}
          style={{ ...styles.button, ...styles.logoutButton }}
        >
          Cerrar Sesión
        </button>
      </div>

      {isEditModalOpen && (
        <div style={styles.editSection}>
          <h3>Editar Perfil</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Teléfono</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Dirección</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              onClick={closeEditModal}
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
