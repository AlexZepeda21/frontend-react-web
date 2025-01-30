import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { motion } from '../components/framer-motion/motion';
import "../styles/Cardcategorias.css";
import { API_BASE_URL } from '../url';  // Asegúrate de configurar esta URL correctamente
import Generador_de_codigo from '../QR/Generador_de_codigo';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Swal from 'sweetalert2'  // Import SweetAlert2
import { Cat } from 'lucide-react';

const Menu = () => {
  const [isOpenGenerador, setIsOpenGenerador] = useState(false);
  const [categoriasMenu, setCategoriasMenu] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [categoriasPorPagina, setCategoriasPorPagina] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState(null); // Para almacenar la categoría seleccionada
  const [showUpdateModal, setShowUpdateModal] = useState(false);    // Controla la visibilidad del modal de actualización
  const navigate = useNavigate(); // Hook para navegar
  const [categoriaOriginal, setCategoriaOriginal] = useState(null); // Nuevo estado para guardar los datos originales

  const openUpdateModal = (categoria) => {
    setCategoriaAEditar(categoria);  // Guardamos la categoría que queremos editar
    setCategoriaOriginal(categoria); // Guardamos una copia de los datos originales
    setShowUpdateModal(true);        // Abrimos el modal
  };

  const [newCategoria, setNewCategoria] = useState({
    nombre: '',
    descripcion: '',
    foto: '',
    estado: true,
  });

  const fetchCategoriasMenu = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categorias_menu`);
      setCategoriasMenu(response.data.categorias_menu || []);
    } catch (err) {
      setError('Error al cargar las categorías del menú');
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const indexOfLastCategory = (currentPage + 1) * categoriasPorPagina;
  const indexOfFirstCategory = indexOfLastCategory - categoriasPorPagina;
  const currentCategorias = categoriasMenu.slice(indexOfFirstCategory, indexOfLastCategory);
  const pageCount = Math.ceil(categoriasMenu.length / categoriasPorPagina);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategoria({
      ...newCategoria,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1]; // Solo la parte base64

        // Si estamos editando una categoría
        if (categoriaAEditar) {
          setCategoriaAEditar({
            ...categoriaAEditar,
            foto: base64Image, // Actualiza la foto de la categoría a editar
          });
        }

        // Si estamos creando una nueva categoría
        if (newCategoria) {
          setNewCategoria((prevState) => ({
            ...prevState,
            foto: base64Image, // Actualiza la foto de la nueva categoría
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const categoryData = { ...newCategoria, foto: newCategoria.foto || null };
      await axios.post(`${API_BASE_URL}/categorias_menu`, categoryData);
      Swal.fire({
        icon: 'success',
        title: 'Categoría creada',
        text: 'La categoría del menu se ha creado con éxito!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      setShowModal(false);
      fetchCategoriasMenu();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Categoria no creada',
        text: 'Comprueba si has agregado todos los campos de manera correcta, tambien es posible que tu conexión este lenta o no estes conectado a la red de itca \nRellena campos vacios sin usar espacios o conectate a una red de itca',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 10000,
      });
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Verificar si no hay cambios
    if (
      categoriaAEditar.nombre === categoriaOriginal.nombre &&
      categoriaAEditar.descripcion === categoriaOriginal.descripcion &&
      categoriaAEditar.foto === categoriaOriginal.foto &&
      categoriaAEditar.estado === categoriaOriginal.estado
    ) {
      Swal.fire({
        icon: 'info',
        title: 'No se han realizado cambios',
        text: 'No has modificado ningún campo.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      return; // Detener la ejecución si no hay cambios
    }

    try {
      const categoryData = { ...categoriaAEditar, foto: categoriaAEditar.foto || null };
      await axios.put(`${API_BASE_URL}/categorias_menu/${categoriaAEditar.id_categoria_menu}`, categoryData);
      Swal.fire({
        icon: 'success',
        title: 'Categoría actualizada',
        text: 'La categoría de receta se ha actualizado con éxito!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      setShowUpdateModal(false);  // Cierra el modal
      fetchCategoriasMenu();       // Actualiza la lista de categorías
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No has podido actualizar la categoria',
        text: 'Probablemente el formato de imagen no es soportado, prueba agregando otra imagen. \n Ademas comprueba si estas conectado a la red de itca',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 7000,
      });
    }
    
  };

  // Función para redirigir al usuario a la página de platos
  const navigateToPlatos = (idCategoriaMenu) => {
    localStorage.setItem("id_categoria_menu", idCategoriaMenu); // Guardamos el ID en el localStorage
    navigate(`/admin/Platos/${idCategoriaMenu}`); // Navegamos a la página de platos con el ID de la categoría
  };

  useEffect(() => {
    fetchCategoriasMenu();
  }, []);

  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="container mt-5 overflow-y-auto max-h-[80vh]">
      {/* Botón Agregar Categoría */}
      <div className="mb-4">
        <button
          className="btn btn-lg btn-primary"
          onClick={() => setShowModal(true)}
        >
          <i className=""></i> Agregar Categoría
        </button>
      </div>

      {/* Mostrar Categorías */}
      <div className="row">
        {currentCategorias.length > 0 ? (
          currentCategorias.map((categoria) => (
            <div className="col-md-3 mb-4" key={categoria.id_categoria_menu}>
              <div className="card shadow-sm">
                <div className="card-body">
                  {/* Título centrado */}
                  <h5 className="card-title text-center">{categoria.nombre}</h5>

                  {/* Contenedor de imagen con clase card-img-container */}
                  <div className="card-img-container text-center">
                    <img
                      src={`data:image/png;base64,${categoria.foto}`}  // Cambié a png según el ejemplo
                      alt={categoria.nombre}
                      className="card-img-top rounded"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  </div>

                  {/* Descripción centrada */}
                  <h8 className="card-title text-center">{categoria.descripcion}</h8>
                </div>
                {/* Footer con los botones centrados */}
                <div className="card-footer text-center">
                  <button
                    onClick={() => openUpdateModal(categoria)}  // Al hacer clic, abre el modal de actualización
                    className="btn btn-primary"
                  >
                    Actualizar
                  </button>

                  <button
                    onClick={() => navigateToPlatos(categoria.id_categoria_menu)}  // Redirige a la página de platos
                    className="btn btn-primary m-1"
                  >
                    Entrar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No hay categorías disponibles</p>
          </div>
        )}
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

      {/* Modal para agregar una nueva categoría */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${showModal ? 'block' : 'hidden'}`}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg"
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white rounded-t-lg">
              <h5 className="text-2xl font-bold">Agregar Categoría de Menú</h5>
              <button type="button" className="absolute top-2 right-2 text-white" onClick={() => setShowModal(false)}>
                <span className="text-3xl">&times;</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
              <div className="mb-3">
                <label htmlFor="nombre" className="text-lg font-medium">Nombre de la Categoría</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  value={newCategoria.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="descripcion" className="text-lg font-medium">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  value={newCategoria.descripcion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="image-upload">
                  {newCategoria.foto ? (
                    <img
                      src={`data:image/jpeg;base64,${newCategoria.foto}`}
                      alt="Previsualización de imagen"
                      className="upload-preview max-w-[200px] mx-auto"
                    />
                  ) : (
                    <span className="upload-placeholder text-center d-block py-4">Click aquí para subir imagen</span>
                  )}
                  <input
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  id="estado"
                  name="estado"
                  className="form-check-input"
                  checked={newCategoria.estado}
                  onChange={() => setNewCategoria({ ...newCategoria, estado: !newCategoria.estado })}
                />
                <label htmlFor="estado" className="form-check-label">Activo</label>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </button>
                <button type="submit" className="btn btn-primary bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                  Agregar
                </button>
              </div>
            </form>
          </motion.div>
        </div>

      </div>

      {/* Modal para actualizar una categoría */}
      <div className={`modal fade ${showUpdateModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showUpdateModal ? 'block' : 'none' }}>
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${showUpdateModal ? 'block' : 'hidden'}`}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg"
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white rounded-t-lg">
              <h5 className="text-2xl font-bold">Actualizar Categoría de Menú</h5>
              <button type="button" className="absolute top-2 right-2 text-white" onClick={() => setShowUpdateModal(false)}>
                <span className="text-3xl">&times;</span>
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
              <div className="mb-3">
                <label htmlFor="nombre" className="text-lg font-medium">Nombre de la Categoría</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  value={categoriaAEditar?.nombre || ''}
                  onChange={(e) => setCategoriaAEditar({ ...categoriaAEditar, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="descripcion" className="text-lg font-medium">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  value={categoriaAEditar?.descripcion || ''}
                  onChange={(e) => setCategoriaAEditar({ ...categoriaAEditar, descripcion: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="image-upload">
                  {categoriaAEditar?.foto ? (
                    <img
                      src={`data:image/png;base64,${categoriaAEditar.foto}`}
                      alt="Previsualización de imagen"
                      className="upload-preview max-w-[200px] mx-auto"
                    />
                  ) : (
                    <span className="upload-placeholder text-center d-block py-4">Click aquí para subir imagen</span>
                  )}
                  <input
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  id="estado"
                  name="estado"
                  className="form-check-input"
                  checked={categoriaAEditar?.estado || false}
                  onChange={() => setCategoriaAEditar({ ...categoriaAEditar, estado: !categoriaAEditar.estado })}
                />
                <label htmlFor="estado" className="form-check-label">Activo</label>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowUpdateModal(false)}>
                  Cerrar
                </button>
                <button type="submit" className="btn btn-primary bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                  Actualizar
                </button>
              </div>
            </form>
          </motion.div>
        </div>

      </div>

      {showUpdateModal && <div className="modal-backdrop fade show" onClick={() => setShowUpdateModal(false)}></div>}


      {showModal && <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>}
    </div>

  );

};

export default Menu;
