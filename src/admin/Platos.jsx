import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../url';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import '../styles/Platos.css';
import '../styles/modal/modal.css'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate



const Platos = () => {
  const { id_categoria_menu } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemsSinCategoria, setMenuItemsSinCategoria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [verModalInventario, setVerModalInventario] = useState(false);
  const [productosActivos, setProductosActivos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [showFormularioModal, setShowFormularioModal] = useState(false);
  const [searchMenuItems, setSearchMenuItems] = useState('');
  const navigate = useNavigate(); // Hook para navegar
  const [searchProductos, setSearchProductos] = useState('');
  const [formPlato, setFormPlato] = useState({
    nombre: '',
    precio: '',
    cantidad_platos: '',
    descripcion: '',
    estado: true,
    imagenBase64: '',
  });



  const reservas = (id_menu) => {
    //localStorage.setItem("id_categoria_menu", id_menu); // Guardamos el ID en el localStorage
    navigate(`/admin/Reservas/${id_menu}`); // Navegamos a la página de platos con el ID de la categoría
  
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
      fetchProductosActivos();
    }
  }, [verModalInventario]);

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

  const fetchProductosActivos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Productosactivos`);
      setProductosActivos(response.data.productos || []);
    } catch (err) {
      console.error('Error al cargar los productos activos', err);
    }
  };

  const fetchMenuItemsSinCategoria = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/filter_cero`);
      setMenuItemsSinCategoria(response.data.message || []);
    } catch (err) {
      console.error('Error al cargar los menús sin categoría', err);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'precio' && value && !/^\d+(\.\d+)?$/.test(value)) {
      Swal.fire({
        icon: 'error',
        title: 'PRECIO INVALIDO',
        text: 'Tiene que ser un numero ya sea entero o decimal y mayor que 0',
        toast: true,  // Hacer que sea una notificación tipo toast
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación en milisegundos
      });
      return;
    }
    setFormPlato({ ...formPlato, [id]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formPlato.nombre || formPlato.precio<=0 ||!formPlato.precio || !formPlato.descripcion || !formPlato.cantidad_platos ||  formPlato.cantidad_platos <=0 || formPlato.cantidad_platos > productoSeleccionado.stock)  {
      Swal.fire({
        icon: 'question',
        title: 'Datos invalidos',
        text: 'La cantidad a agregar debe ser mayor a 0, el precio no puede ser menor a 0, o exactamente 0',
        toast: true,  // Hacer que sea una notificación tipo toast
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación en milisegundos
      });
      return;
    }
    try {
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
        Swal.fire({
          icon: 'success',
          title: 'Se agrego ' + formPlato.nombre,
          text: 'Se creo un espacio para este producto en esta categoria!',
          toast: true,  // Hacer que sea una notificación tipo toast
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación en milisegundos
        });
        setVerModalInventario(false)
        setShowFormularioModal(false);  // Esto cerrará el modal del formulario
        

        fetchMenuItems();
      } else {
        Swal.fire({
          icon: 'question',
          title: 'No se agrego el producto a la categoria',
          text: 'Pruebe cambiando de imagen',
          toast: true,  // Hacer que sea una notificación tipo toast
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación en milisegundos
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        tittle: 'Ha ocurrido un error en el servidor',
        text: 'Pruebe cambiar de imagen o verifique si esta conectado a una red de itca',
        toast: true,  // Hacer que sea una notificación tipo toast
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación en milisegundos
      });
    }
  };

  const handleAgregarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setShowFormularioModal(true);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/menu/${id}`, {
        id_categoria: id_categoria_menu,
      });
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Has agregado un plato al menu',
          text: 'El plato se ha creado en esta categoria',
          toast: true,  
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  
        });
        fetchMenuItems();
        setShowModal(false);

        
      }
    } catch (err) {
      console.error('Error al actualizar el menú', err);
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar el menú',
        text: 'Conectese a Itca',
        toast: true,  // Hacer que sea una notificación tipo toast
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación en milisegundos
      });
    }
  };

  const filteredMenuItems = menuItemsSinCategoria.filter(item =>
    item.nombre.toLowerCase().includes(searchMenuItems.toLowerCase())
  );

  const filteredProductos = productosActivos.filter(item =>
    item.nombre.toLowerCase().includes(searchProductos.toLowerCase())
  );

  if (loading) return <Container className="text-center py-5"><h2>Cargando menús...</h2></Container>;
  if (error) return <Container className="text-center py-5"><h2 className="text-danger">{error}</h2></Container>;

  return (
    <Container fluid className="py-5">
      <Row className="mb-4">
        <Col className="text-center">
          <Button variant="primary" className="me-3" onClick={() => setShowModal(true)}>
            Agregar Platos
          </Button>
          <Button variant="success" onClick={() => setVerModalInventario(true)}>
            Agregar del inventario
          </Button>
        </Col>
      </Row>

      <Row xs={1} md={2} lg={3} className="g-4">
        {menuItems.length > 0 ? (
          menuItems.map(item => (
            <Col key={item.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={item.img ? `data:image/jpeg;base64,${item.img}` : "https://via.placeholder.com/300"}
                    alt={item.nombre}
                    style={{ objectFit: 'cover', height: '200px' }}
                  />
                  <Card.Body>
                    <Card.Title>{item.nombre}</Card.Title>
                    <Card.Text>{item.descripcion}</Card.Text>
                    <Card.Text><strong>Precio:</strong> ${item.precio}</Card.Text>
                    <Card.Text><strong>Cantidad disponible:</strong> {item.cantidad_platos}</Card.Text>
                    <Badge bg={item.estado ? "success" : "danger"}>
                      {item.estado ? "Disponible" : "No disponible"}
                    </Badge>
                    
                  </Card.Body>
                  <button
                  onClick={() => reservas(item.id_menu)} 
                    className="btn btn-primary m-1"
                  >
                    Entrar
                  </button>
                </Card>
              </motion.div>
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center">
            <h3>No hay platos, agregue platos.</h3>
          </Col>
        )}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header
          closeButton
          className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-t-lg"
        >
          <Modal.Title>Platos sin categoria asignada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por nombre..."
              value={searchMenuItems}
              onChange={(e) => setSearchMenuItems(e.target.value)}
            />
          </InputGroup>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table responsive striped bordered hover>
              <thead className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenuItems.length > 0 ? (
                  filteredMenuItems.map((item) => (
                    <tr key={item.id_menu}>
                      <td>{item.id_menu}</td>
                      <td>{item.nombre}</td>
                      <td>{item.descripcion}</td>
                      <td>${item.precio}</td>
                      <td>{item.cantidad_platos}</td>
                      <td>
                        <Badge bg={item.estado ? "success" : "danger"}>
                          {item.estado ? "Disponible" : "No disponible"}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="success" size="sm" onClick={() => handleUpdate(item.id_menu)}>
                          Agregar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No hay menús sin categoría</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>


      <Modal show={verModalInventario} onHide={() => setVerModalInventario(false)} className="custom-modal">
        <Modal.Header
          closeButton
          className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-t-lg"
        >
          <Modal.Title>Menús sin Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por nombre..."
              value={searchProductos}
              onChange={(e) => setSearchProductos(e.target.value)}
            />
          </InputGroup>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Unidad</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.length > 0 ? (
                  filteredProductos.map((item) => (
                    <tr key={item.id_producto}>
                      <td>{item.id_producto}</td>
                      <td>{item.nombre}</td>
                      <td>{item.descripcion}</td>
                      <td>{item.unidad_medida}</td>
                      <td>{item.categoria}</td>
                      <td>
                        <Badge bg={item.estado ? "success" : "danger"}>
                          {item.estado ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td>{item.stock}</td>
                      <td>
                        <Button variant="success" size="sm" onClick={() => handleAgregarProducto(item)}>
                          Agregar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No hay productos activos</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showFormularioModal} onHide={() => setShowFormularioModal(false)} className="custom-modal">
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Formulario de Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productoSeleccionado && (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>ID Producto</Form.Label>
                <Form.Control type="number" value={productoSeleccionado.id_producto} readOnly />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" value={formPlato.nombre || productoSeleccionado?.nombre || ''} readOnly />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control type="number" id="precio" value={formPlato.precio} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cantidad de producto a agregar (max: {productoSeleccionado.stock})</Form.Label>
                <Form.Control
                  type="number"
                  id="cantidad_platos"
                  value={formPlato.cantidad_platos}
                  onChange={handleChange}
                  max={productoSeleccionado.stock}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  id="descripcion"
                  value={formPlato.descripcion}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleImageChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="estado"
                  label="Estado"
                  checked={formPlato.estado}
                  onChange={(e) => setFormPlato({ ...formPlato, estado: e.target.checked })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>ID Categoría de Menú</Form.Label>
                <Form.Control
                  type="number"
                  value={formPlato.id_categoria || id_categoria_menu}
                  readOnly
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowFormularioModal(false)}>
                  Cerrar
                </Button>
                <Button variant="primary" type="submit">
                  Guardar
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Platos;
