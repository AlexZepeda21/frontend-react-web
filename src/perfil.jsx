import React, { useState, useEffect } from 'react';
import "../../styles/Profile/Profile.css"; // Crea este archivo CSS para estilizar
import profileImg from '../../img/profile-placeholder.png'; // Imagen predeterminada para el perfil
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simular obtención de datos del usuario desde el localStorage o API
    const userData = JSON.parse(localStorage.getItem('userData')) || {
      name: "Usuario Invitado",
      email: "correo@ejemplo.com",
      avatar: profileImg,
    };
    setUser(userData);
    setName(userData.name);
    setEmail(userData.email);
  }, []);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const handleSave = () => {
    const updatedUser = { ...user, name, email };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser)); // Guardar cambios
    closeEditModal();
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Eliminar token del almacenamiento local
    navigate('/'); // Redirigir a la página de inicio de sesión
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={user?.avatar || profileImg}
          alt="Foto de perfil"
          className="profile-avatar"
        />
        <h1 className="profile-name">{user?.name}</h1>
        <p className="profile-email">{user?.email}</p>
      </div>

      <div className="profile-actions">
        <button onClick={openEditModal} className="btn-edit">
          Editar Perfil
        </button>
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>

      {/* Modal para editar perfil */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        className="modal-content mx-auto max-w-md rounded-lg bg-white shadow-lg p-6"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h1 className="text-xl font-bold text-center mb-4">Editar Perfil</h1>
        <div className="form-group mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Guardar
          </button>
          <button
            onClick={closeEditModal}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Profile;
