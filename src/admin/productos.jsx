import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaBook } from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { API_BASE_URL } from '../url';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "react-modal";
import "../styles/styleproduct.css";
import Mdinformacionproductos from '../components/Mdinformacionproductos';
import MdActializarproducto from '../components/MdActializarproducto';
// Configurar React Modal
Modal.setAppElement("#root");



const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [unidad_medida, setunidad_medida] = useState([]);
  const [catepro, setcatepro] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [productosporpagina] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false); 
  const [isOpens, setIsOpens] = useState(false); 
  const [productoSeleccionado, setproductoSeleccionado] = useState(null); 
  const [productoSeleccionados, setproductoSeleccionados] = useState(null); 


  const [formData, setFormData] = useState({
    nombre_unidad: "",
    id_unidad_medida: "",
    descripcion: "",
    id_usuario: "",
    id_categoria_pro: "",
    foto: null,
    imagenBase64: '',
    nombre: '',
  });


  const [formDatapro, setFormDatapro] = useState({
    nombre_categoria: "",
    id_categoria_pro: "",

  });


  const openinfoModal = (producto) => {
    setproductoSeleccionado(producto);  
    setIsOpen(true);  
  };

  const openactualizarModal = (producto) => {
    setproductoSeleccionados(producto);  
    setIsOpens(true);  
  };

  useEffect(() => {
    const fetchcatepro = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/listasolo1`);
        const data = await response.json();
        // Asignamos el array de categorías al estado, asegurándonos de que sea un array vacío si no hay datos
        setcatepro(data.categorias_productos || []);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setcatepro([]); // Si hay error, asignamos un array vacío
      }
    };

    fetchcatepro();
  }, []);


  useEffect(() => {
    const fetchUnidadesMedida = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/listasolounidademedia1`);
        const data = await response.json();
        // Asignamos el array de categorías al estado, asegurándonos de que sea un array vacío si no hay datos
        setunidad_medida(data.unidad_medida || []);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setunidad_medida([]); // Si hay error, asignamos un array vacío
      }
    };

    fetchUnidadesMedida();
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        const data = await response.json();
        setProductos(data.productos || []);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        setProductos([]);
      }
    };

    fetchProductos();
  }, []);

  const indexOfLastProduct = (currentPage + 1) * productosporpagina;
  const indexOfFirstProduct = indexOfLastProduct - productosporpagina;

  const filteredproductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentProducts = filteredproductos.slice(indexOfFirstProduct, indexOfLastProduct);

  const pageCount = Math.ceil(filteredproductos.length / productosporpagina);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [image, setImage] = useState(null);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Convertir la imagen a base64 y almacenarla en el estado
        setFormData((prevData) => ({
          ...prevData,
          imagenBase64: reader.result.split(',')[1], // Extraemos solo la parte base64 de la URL
        }));
      };
      reader.readAsDataURL(file); // Leer el archivo como URL base64
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const id = localStorage.getItem('id');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mostrar alerta antes de enviar los datos
    alert('Enviando datos...');

    try {
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foto: formData.imagenBase64,
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          id_unidad_medida: formData.id_unidad_medida,
          id_categoria_pro: formData.id_categoria_pro,
          id_usuario: id ,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        // Si la respuesta es exitosa, muestra un mensaje de éxito
        alert('Producto registrado con éxito');
      } else {
        // Si hay un error en la respuesta, muestra un mensaje de error
        alert('Error al registrar el producto');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Ocurrió un error al enviar los datos');
    }
  };



  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Listado de Productos</h1>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="App">
        <button onClick={openModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px', // Margen inferior
          }}
          className="open-modal-button">
          Registrar Producto
        </button>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2>Registro de Producto</h2>
          <form onSubmit={handleSubmit} className="product-form">
            {/* Componente de carga de imagen */}
            <div className="form-group">
              <label className="image-upload">
                {image ? (
                  <img
                    src={image}
                    alt="Previsualización de imagen"
                    className="upload-preview"
                  />
                ) : (
                  <span className="upload-placeholder text-center">Subir Imagen</span>
                )}
                <input
                  type="file"
                  className="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Otros campos del formulario */}
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del producto"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}

                className="form-control"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Unidad de Medida</label>
                <select
                  name="id_unidad_medida"
                  value={formData.id_unidad_medida}
                  onChange={(e) => setFormData({ ...formData, id_unidad_medida: e.target.value })}
                  className="form-control"
                >
                  <option value="">Seleccionar unidad</option>
                  {/* Aquí mapeamos los datos de las categorías a las opciones del select */}
                  {unidad_medida.map((unidad) => (
                    <option key={unidad.id_unidad_medida} value={unidad.id_unidad_medida}>
                      {unidad.nombre_unidad} {/* Asumiendo que 'nombre' es el campo que contiene el nombre de la unidad */}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Categoría del Producto</label>
                <select
                  name="id_categoria_pro"
                  value={formData.id_categoria_pro}
                  onChange={(e) => setFormData({ ...formData, id_categoria_pro: e.target.value })}
                  className="form-control"
                >
                  <option value="">Seleccionar una categoria</option>
                  {/* Aquí mapeamos los datos de las categorías a las opciones del select */}
                  {catepro.map((cate_pro) => (
                    <option key={cate_pro.id_categoria_pro} value={cate_pro.id_categoria_pro}>
                      {cate_pro.nombre_categoria} {/* Asumiendo que 'nombre' es el campo que contiene el nombre de la unidad */}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                placeholder="Describe el producto..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="form-control"
                style={{ resize: 'vertical', minHeight: '100px' }}
              ></textarea>

            </div>

            {/* Botones de acción */}
            <div className="button-group">
              <button type="button" onClick={closeModal} className="cancel-button">
                Cerrar
              </button>
              <button type="submit" className="save-button">
                Guardar cambios
              </button>
            </div>
          </form>
        </Modal>
      </div>

      <div className="row">
        {currentProducts.length > 0 ? (
          currentProducts.map((productos) => (
            <div className="col-md-4 mb-4" key={productos.id_producto}>
              <Card style={{ minHeight: "300px", maxHeight: "400px" }}>
                <Card.Body>
                  <div className="text-center mb-3">
                    <img
                      src={`data:image/png;base64,${productos.foto}`}
                      alt="Imagen del producto"
                      style={{
                        width: "450px",
                        height: "175px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        backgroundColor: "#f5f5f6",
                      }}
                    />


                  </div>
                  <Card.Title>{productos.nombre}</Card.Title>
                  <Card.Text>
                    {productos.descripcion.length > 35
                      ? `${productos.descripcion.slice(0, 35)}...`
                      : productos.descripcion}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="success"
                      onClick={() => openinfoModal(productos)} // Abrimos el modal y pasamos la categoría
                    >
                      Ver más
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => openactualizarModal(productos)} // Abrimos el modal y pasamos la categoría
                    >
                      Actualizar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => openinfoModal(productos)} // Abrimos el modal y pasamos la categoría
                    >
                      Ingresar
                    </Button>
                  </div>

                </Card.Body>
              </Card>
            </div>

          ))
        ) : (
          <div className="col-12 text-center">
            <p>No hay categorías disponibles</p>
          </div>
        )}
      </div>

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
      {isOpen && productoSeleccionado && (
        <Mdinformacionproductos 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          producto={productoSeleccionado}  
        />
      )}

{isOpens && productoSeleccionados && (
        <MdActializarproducto
          isOpen={isOpens}
          setIsOpen={setIsOpens}
          producto={productoSeleccionados}  
        />
      )}
    </div>

    
  );
};

export default Productos;
