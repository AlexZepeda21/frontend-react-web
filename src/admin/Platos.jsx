import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../url';  // Asegúrate de configurar esta URL correctamente
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';  // Importamos los componentes Modal y Button de Bootstrap
import '../styles/Platos.css';  // Asegúrate de importar la hoja de estilos personalizada

const Platos = () => {
  const { id_categoria_menu } = useParams();  // Obtenemos el id_categoria de la URL
  const [menuItems, setMenuItems] = useState([]);  // Menús con id_categoria
  const [menuItemsSinCategoria, setMenuItemsSinCategoria] = useState([]);  // Menús sin id_categoria
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); 
  const [showModal, setShowModal] = useState(false);  // Estado para controlar la visibilidad del modal

  // Función para cargar los menús con categoría
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/menu_filter?id_categoria=${id_categoria_menu}`);
      setMenuItems(response.data.message || []);  // Asegúrate de que si no hay datos, se asigne un array vacío
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los menús con categoría');
      setLoading(false);
    }
  };

  // Función para cargar los menús que no tienen id_categoria
  const fetchMenuItemsSinCategoria = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/filter_cero`);
      if (response.data.message) {
        setMenuItemsSinCategoria(response.data.message || []); // Solo asigna los datos si existen
      } else {
        setMenuItemsSinCategoria([]);  // Si no hay datos, asigna un array vacío
      }
    } catch (err) {
    
     
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/menu/${id}`, {
        id_categoria: id_categoria_menu, // Actualiza la categoría
      });

      if (response.status === 200) {
        alert('Menú actualizado exitosamente');
        setMenuItems(menuItems.map(item => item.id === id ? response.data : item));
        window.location.reload();
      }
    } catch (err) {
      console.error('Error al actualizar el menú', err);
      alert('Error al actualizar el menú');
    }
  };

  useEffect(() => {
    fetchMenuItems();  // Solo cargamos los menús con categoría al inicio
  }, [id_categoria_menu]);  // Solo depende de la categoría, no de `showModal`

  useEffect(() => {
    if (showModal) {  // Solo cargamos los menús sin categoría si el modal está abierto
      fetchMenuItemsSinCategoria();
    }
  }, [showModal]);  // Dependiendo de la visibilidad del modal

  if (loading) return <div className="text-center">Cargando menús...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <button
          className="btn btn-primary"
          onClick={handleShowModal}  // Al hacer clic, abre el modal
        >
          Agregar Platos
        </button>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {menuItems.length > 0 ? (
          menuItems.map(item => (
            <div key={item.id} className="col">
              <div className="card shadow-sm border-light rounded-3">
                <img
                  src={item.img ? `data:image/jpeg;base64,${item.img}` : "https://via.placeholder.com/300"}
                  alt={item.nombre}
                  className="card-img-top rounded-top"
                  style={{
                    objectFit: 'cover',
                    maxHeight: '150px',
                    height: '150px',
                    width: '100%',
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.nombre}</h5>
                  <p className="card-text">{item.descripcion}</p>
                  <p className="card-text"><strong>Precio:</strong> ${item.precio}</p>
                  <p className="card-text"><strong>Cantidad disponible:</strong> {item.cantidad_platos}</p>
                  <p className={`badge ${item.estado ? "bg-success" : "bg-danger"}`}>
                    {item.estado ? "Disponible" : "No disponible"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No hay platos, agregue platos.</p>
          </div>
        )}
      </div>

      {/* Modal para mostrar los menús sin categoría */}
      <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-fullscreen">
        <Modal.Header closeButton>
          <Modal.Title>Menús sin Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>A continuación se muestran los menús que no tienen categoría.</p>

          {/* Tabla común para mostrar los menús */}
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Cantidad Disponible</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {menuItemsSinCategoria.length > 0 ? (
                menuItemsSinCategoria.map((item) => (
                  <tr key={item.id_menu}>
                    <td>{item.id_menu}</td>
                    <td>{item.nombre}</td>
                    <td>{item.descripcion}</td>
                    <td>${item.precio}</td>
                    <td>{item.cantidad_platos}</td>
                    <td>{item.estado ? 'Disponible' : 'No disponible'}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => handleUpdate(item.id_menu)}
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No hay menús sin categoría</td>
                </tr>
              )}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
          <Button variant="primary" onClick={() => alert('Agregar plato funcionalidad aquí.')}>Agregar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Platos;
