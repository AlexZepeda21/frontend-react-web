import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import "../styles/Cardcategorias.css";
import { API_BASE_URL } from '../url';
import MdActualizarCateRecetas from '../components/MdActualizarCateRecetas';
import MdAgregarCateRecetas from '../components/MdAgregarCateRecetas';
import { useNavigate } from 'react-router-dom';

const Categoria_recetasChef = () => {
  const [categorias, setCategorias] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [categoriasPorPagina, setCategoriasPorPagina] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const navigateNow = useNavigate();

  useEffect(() => {
    
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cate_recetas`);
        const data = await response.json();
        // Ordenar categorías en orden descendente por ID (asumimos que id_categoria_recetas es el ID)
        const categoriasOrdenadas = data.categorias_recetas || [];
        categoriasOrdenadas.sort((a, b) => b.id_categoria_recetas - a.id_categoria_recetas);
        setCategorias(categoriasOrdenadas);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setCategorias([]);
      }
    };

    fetchCategorias();
  }, []);

  const indexOfLastCategory = (currentPage + 1) * categoriasPorPagina;
  const indexOfFirstCategory = indexOfLastCategory - categoriasPorPagina;

  // Filtrar categorías basadas en la búsqueda
  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mostrar las categorías actuales basadas en la página y el filtro de búsqueda
  const currentCategorias = filteredCategorias.slice(indexOfFirstCategory, indexOfLastCategory);
  const pageCount = Math.ceil(filteredCategorias.length / categoriasPorPagina);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Función para agregar una categoría
  const handleAddCategory = (newCategory) => {
    setCategorias((prevCategorias) => [newCategory, ...prevCategorias]); // Insertar la nueva categoría al principio
  };

  const openUpdateModal = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setIsOpen(true);
  };

  // Función para navegar a la página de recetas con el id de la categoría
  const navegar = (categoriaId) => {
    localStorage.setItem("id_categoria_recetas", categoriaId);
    navigateNow(`/chef/recetas/${categoriaId}`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl titulo font-bold tracking-tight">Categoria de recetas</h1>
      <p className="titulo font-bold tracking-tight">Agregue categorias por ejemplo: Pures, Ensaladas, Postres...</p>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <MdAgregarCateRecetas handleAddCategory={handleAddCategory} />
      </div >

      <div className="row">
        {currentCategorias.length > 0 ? (
          currentCategorias.map((categoria) => (
            <div className="col-md-3 mb-4" key={categoria.id_categoria_recetas}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-center">{categoria.nombre}</h5>
                  <div className="card-img-container">
                    <img
                      src={`data:image/png;base64,${categoria.foto}`}
                      alt={categoria.nombre}
                      className="card-img-top rounded"
                    />
                  </div>
                  <h8 className="card-title text-center">{categoria.descripcion}</h8>
                  <div className="card-footer text-center">
                    <button onClick={() => openUpdateModal(categoria)} className="btn btn-primary">
                      Actualizar
                    </button>
                    <button onClick={() => navegar(categoria.id_categoria_recetas)} className="btn btn-primary m-1">
                      Ver recetas
                    </button>
                  </div>
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

      {isOpen && categoriaSeleccionada && (
        <MdActualizarCateRecetas
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          categoria={categoriaSeleccionada}
        />
      )}
    </div>
  );
};

export default Categoria_recetasChef;
