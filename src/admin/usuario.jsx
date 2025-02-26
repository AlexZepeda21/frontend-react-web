/*import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../url';
import Swal from 'sweetalert2'; // Para mostrar mensajes de éxito/error


function UserTable() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${ API_BASE_URL }/user`);
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
      const response = await fetch(`${ API_BASE_URL }/user/${id}/status`, {
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
          text: `El usuario ha sido ${ newStatus? 'activado': 'desactivado' }. `,
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

export default UserTable;*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/tabledesign";
import { API_BASE_URL } from '../url';
import MdEditarUsuario from '../components/MdEditarUsuario'; // Modal for editing user
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import '../styles/Perfil/unidades.css';

const UsuarioList = () => {
  const [usuarios, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [usuariosPorPagina, setUsuariosPorPagina] = useState(2);  // Default users per page
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const indexOfLastUsuario = (currentPage + 1) * usuariosPorPagina;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPorPagina;

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(usuario.id_tipo_usuario).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUsuarios = filteredUsuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);
  const pageCount = Math.ceil(filteredUsuarios.length / usuariosPorPagina);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const openModalEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowModalEditar(true);
  };

  const handleDesactivar = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 0 }),
      });
  
      if (!response.ok) {
        throw new Error('Error al desactivar el usuario.');
      }
  
      const result = await response.json();

      setUsers((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id_usuario === id ? { ...usuario, ...result.message } : usuario
        )
      );
    } catch (error) {
      console.error(error);
      setError('Error al desactivar el usuario.');
    }
  };
  

  const handleUsuariosPorPaginaChange = (event) => {
    setUsuariosPorPagina(Number(event.target.value)); // Update the number of users per page
    setCurrentPage(0); // Reset to first page
  };

  const actualizarusuario =(usuarioactu)=>{
    setUsers((prevUsuarios) =>
      prevUsuarios.map((usuario) =>
        usuario.id_usuario === usuarioactu.id_usuario ? { ...usuario, ...usuarioactu } : usuario
      )
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl titulo font-bold tracking-tight">Lista de Usuarios</h1>
        <Button
          onClick={() => navigate(`${ADMIN}/registro`)}
          size="lg"
          className='m-1 btn-agregar'
        >
          Agregar Usuario
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar usuario"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Dropdown to select the number of users per page */}
      <div className="mb-4">
        <select
          value={usuariosPorPagina}
          onChange={handleUsuariosPorPaginaChange}
          className="form-select"
          style={{ width: '125px', maxWidth: '200px' }} // Adjust the width here
        >
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>


      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showModalEditar && usuarioSeleccionado && (
        <MdEditarUsuario
          showModalEditar={showModalEditar}
          setShowModalEditar={setShowModalEditar}
          usuario={usuarioSeleccionado}
          actualizarusuario={actualizarusuario}
        />
      )}

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Tipo Usuario</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>apellido</TableHead>
              <TableHead>nombre</TableHead>
              <TableHead>Ocupación</TableHead>
              <TableHead>genero</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsuarios.length > 0 ? (
              currentUsuarios.map((usuario, index) => (
                <TableRow key={usuario.id_usuario} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  {/* Tipo de Usuario */}
                  <TableCell>
                    {(() => {
                      switch (Number(usuario.id_tipo_usuario)) {
                        case 1:
                          return "Administrador";
                        case 2:
                          return "Chef";
                        default:
                          return "Desconocido";
                      }
                    })()}
                  </TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                  
                  
                  <TableCell>
                    {usuario.apellido}
                  </TableCell>

                  <TableCell>
                  {usuario.nombre}
                  </TableCell>

                  <TableCell>
                  {usuario.carrera}
                  </TableCell>

                  <TableCell>
                  {usuario.genero}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      let claseEstado = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";
                      let textoEstado = "";

                      if (Number(usuario.estado) === 1) {
                        claseEstado += "bg-green-100 text-green-800";
                        textoEstado = "Activo";
                      } else {
                        claseEstado += "bg-red-100 text-gray-800";
                        textoEstado = "Inactivo";
                      }

                      return (
                        <span className={claseEstado}>
                          {textoEstado}
                        </span>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <button
                      className="btn btn-edit d-flex align-items-center m-1"
                      onClick={() => openModalEditar(usuario)}
                    >
                      <FaEdit className="me-1 btn-edit" /> Editar
                    </button>
                    {Number(usuario.estado) === 1 && (
                      <button
                        className="btn btn-danger d-flex align-items-center m-1"
                        onClick={() => handleDesactivar(usuario.id_usuario)}
                      >
                        <FaTrashAlt className="me-1" /> Desactivar
                      </button>
                    )}
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No hay usuarios disponibles.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="d-flex justify-content-center mt-4">
        <ReactPaginate
          previousLabel={'Anterior'}
          nextLabel={'Siguiente'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={4}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
        />
      </div>
    </div>
  );
};

export default UsuarioList;

