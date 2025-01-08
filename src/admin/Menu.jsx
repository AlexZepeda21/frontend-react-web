import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import "../styles/Cardcategorias.css";
import { API_BASE_URL } from '../url';  // Asegúrate de configurar esta URL correctamente
import Generador_de_codigo from '../QR/Generador_de_codigo';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate


const Menu = () => {
  const [isOpenGenerador, setIsOpenGenerador] = useState(false);
  const [categoriasMenu, setCategoriasMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [categoriasPorPagina, setCategoriasPorPagina] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [categoriaAEditar, setCategoriaAEditar] = useState(null); // Para almacenar la categoría seleccionada
  const [showUpdateModal, setShowUpdateModal] = useState(false);    // Controla la visibilidad del modal de actualización
  const navigate = useNavigate(); // Hook para navegar

  const openUpdateModal = (categoria) => {
    setCategoriaAEditar(categoria);  // Guardamos la categoría que queremos editar
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
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las categorías del menú');
      setLoading(false);
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
      setShowModal(false);
      fetchCategoriasMenu();
    } catch (err) {
      setError(`Error al agregar la categoría: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = { ...categoriaAEditar, foto: categoriaAEditar.foto || null };
      await axios.put(`${API_BASE_URL}/categorias_menu/${categoriaAEditar.id_categoria_menu}`, categoryData);
      setShowUpdateModal(false);  // Cierra el modal
      fetchCategoriasMenu();       // Actualiza la lista de categorías
    } catch (err) {
      setError(`Error al actualizar la categoría: ${err.response?.data?.message || err.message}`);
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

  if (loading) return <div className="text-center"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="container mt-5 overflow-y-auto max-h-[80vh]">
      {/* Botón Agregar Categoría */}
      <div className="mb-4">
        <button
          className="btn btn-lg btn-success"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus"></i> Agregar Categoría
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
                  <h5 className="card-title text-center">{categoria.nombre}, id: {categoria.id_categoria_menu}</h5>

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
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar Categoría de Menú</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre de la Categoría</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    value={newCategoria.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    className="form-control"
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
                        className="upload-preview"
                        style={{ maxWidth: '200px' }}
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
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </button>
                <button type="submit" className="btn btn-primary">Agregar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Modal para actualizar una categoría */}
      <div className={`modal fade ${showUpdateModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showUpdateModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Actualizar Categoría de Menú</h5>
              <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
            </div>
            <form onSubmit={handleUpdateSubmit}>
              <div className="modal-body">
                {/* Campos prellenados con la categoría que estamos editando */}
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre de la Categoría</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    value={categoriaAEditar?.nombre || ''}
                    onChange={(e) => setCategoriaAEditar({ ...categoriaAEditar, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    className="form-control"
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
                  className="upload-preview"
                  style={{ maxWidth: '200px' }}
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
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                  Cerrar
                </button>
                <button type="submit" className="btn btn-primary">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showUpdateModal && <div className="modal-backdrop fade show" onClick={() => setShowUpdateModal(false)}></div>}


      {showModal && <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>}
    </div>

  );

};

export default Menu;
