import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../url';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import '../styles/Platos.css';

const Platos = () => {
  const { id_categoria_menu } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemsSinCategoria, setMenuItemsSinCategoria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [verModalInventario, setverModalInventario] = useState(false);
  const [productosActivos, setProductosActivos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [showFormularioModal, setShowFormularioModal] = useState(false);

  const [formPlato, setFormPlato] = useState({
    nombre: '',
    precio: '',
    cantidad_platos: '',
    descripcion: '',
    estado: true,
    imagenBase64: '',
  });

  useEffect(() => {
    if (productoSeleccionado) {
      setFormPlato({
        nombre: productoSeleccionado.nombre,
        precio: productoSeleccionado.precio,
        cantidad_platos: productoSeleccionado.cantidad_platos,
        descripcion: productoSeleccionado.descripcion,
        estado: productoSeleccionado.estado,
        imagenBase64: productoSeleccionado.img || '',
        id_categoria_menu: id_categoria_menu,
      });
    }
  }, [productoSeleccionado, id_categoria_menu]);



  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'precio' && value && !/^\d+(\.\d+)?$/.test(value)) {
      alert("Por favor, ingresa un precio válido (puede ser un número entero o decimal).");
      return;
    }
    
    setFormPlato({
      ...formPlato,
      [id]: value,
    });
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormPlato((prevForm) => ({
          ...prevForm,
          imagenBase64: reader.result.split(',')[1],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  //Metodo para crear plato
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formPlato);
    
    if (!formPlato.nombre || !formPlato.precio || !formPlato.descripcion || !formPlato.cantidad_platos && formPlato.cantidad_platos < productoSeleccionado.stock) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    try {
      alert(id_categoria_menu)
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        body: JSON.stringify({
          nombre: formPlato.nombre,
          precio: formPlato.precio,
          cantidad_platos: formPlato.cantidad_platos,
          descripcion: formPlato.descripcion,
          estado: formPlato.estado,
          img: formPlato.imagenBase64,
          id_categoria: id_categoria_menu,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok) {
        alert('Plato creado con éxito!');
        setverModalInventario(false);
      } else {
        alert(result);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Hubo un error al crear el plato: ${error.message}`);
    }
  };



  // Función para cargar los menús con categoría
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/menu_filter?id_categoria=${id_categoria_menu}`);
      setMenuItems(response.data.message || []);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los menús con categoría');
      setLoading(false);
    }
  };

  // Función para cargar los productos activos
  const fetchProductosActivos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Productosactivos`);
      if (response.data.productos) {
        setProductosActivos(response.data.productos);
      } else {
        setProductosActivos([]);
      }
    } catch (err) {
      console.error('Error al cargar los productos activos', err);
    }
  };

  // Función para cargar los menús que no tienen id_categoria
  const fetchMenuItemsSinCategoria = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/filter_cero`);
      if (response.data.message) {
        setMenuItemsSinCategoria(response.data.message || []);
      } else {
        setMenuItemsSinCategoria([]);
      }
    } catch (err) {

    }
  };

  const handleAgregarProducto = (producto) => {
    setProductoSeleccionado(producto);  // Guarda el producto seleccionado
    setShowFormularioModal(true);  // Muestra el modal con el formulario
  };


  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/menu/${id}`, {
        id_categoria: id_categoria_menu,
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
    fetchMenuItems();
  }, [id_categoria_menu]);

  useEffect(() => {
    if (showModal) {
      fetchMenuItemsSinCategoria();
    }
  }, [showModal]);


  useEffect(() => {
    if (verModalInventario) {
      fetchProductosActivos();  // Cargar productos activos cuando el modal se muestra
    }
  }, [verModalInventario]);

  if (loading) return <div className="text-center">Cargando menús...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const verInventarioModal = () => setverModalInventario(true);
  const cerrarInventarioModal = () => setverModalInventario(false);


  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <button
          className="btn btn-primary"
          onClick={handleShowModal}
        >
          Agregar Platos
        </button>
        <button
          className="btn btn-primary m-3"
          onClick={verInventarioModal}
        >
          Agregar del inventario
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

      {/* Modal para mostrar los productos del inventario */}
      <Modal show={verModalInventario} onHide={cerrarInventarioModal} dialogClassName="modal-fullscreen">
        <Modal.Header closeButton>
          <Modal.Title>Productos del Inventario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>A continuación se muestran los productos activos desde el inventario.</p>

          {/* Tabla para mostrar los productos activos */}
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Unidad de Medida</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosActivos.length > 0 ? (
                productosActivos.map((item) => (
                  <tr key={item.id_producto}>
                    <td>{item.id_producto}</td>
                    <td>{item.nombre}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.unidad_medida}</td>
                    <td>{item.categoria}</td>
                    <td>{item.estado ? 'Activo' : 'Inactivo'}</td>
                    <td>{item.stock}</td>

                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => handleAgregarProducto(item)}
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No hay productos activos</td>
                </tr>
              )}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarInventarioModal}>Cerrar</Button>
          <Button variant="primary" onClick={() => alert('Agregar plato funcionalidad aquí.')}>Agregar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para agregar los productos del inventario */}
      <Modal show={showFormularioModal} onHide={() => setShowFormularioModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Formulario de Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productoSeleccionado && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="idProducto" className="form-label">ID Producto</label>
                <input
                  type="number"
                  className="form-control"
                  id="idProducto"
                  value={productoSeleccionado.id_producto}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="nombreProducto" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreProducto"
                  value={formPlato.nombre || productoSeleccionado?.nombre || ''}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="precio" className="form-label">Precio</label>
                <input
                  type="number"
                  className="form-control"
                  id="precio"
                  value={formPlato.precio}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="cantidad_platos" className="form-label">Que cantidad de producto a agregar de {productoSeleccionado.stock} posibles</label>
                <input
                  type="number"
                  className="form-control"
                  id="cantidad_platos"
                  value={formPlato.cantidad_platos}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  id="descripcion"
                  value={formPlato.descripcion}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="imagenBase64" className="form-label">Imagen</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="estado" className="form-label">Estado</label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="estado"
                  checked={formPlato.estado}
                  onChange={(e) => setFormPlato({ ...formPlato, estado: e.target.checked })}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="idCategoriaMenu" className="form-label">ID Categoría de Menú</label>
                <input
                  type="number"
                  className="form-control"
                  id="idCategoriaMenu"
                  value={formPlato.id_categoria || id_categoria_menu}
                  onChange={handleChange}
                  readOnly
                />
              </div>

              {/* Botón de enviar dentro del formulario */}
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowFormularioModal(false)}>Cerrar</Button>
                <Button variant="primary" type="submit">Guardar</Button> {/* Enviar el formulario aquí */}
              </Modal.Footer>
            </form>
          )}
        </Modal.Body>
      </Modal>



    </div>
  );
};

export default Platos;
