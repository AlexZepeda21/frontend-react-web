
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaBook } from 'react-icons/fa';
import { AiOutlineReconciliation } from "react-icons/ai";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { API_BASE_URL } from '../url';




const Categoria_recetas = () => {

  const [categorias, setCategorias] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [categoriasPorPagina, setCategoriasPorPagina] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cate_recetas`);
        const data = await response.json();
        // Asignamos el array de categorías al estado, asegurándonos de que sea un array vacío si no hay datos
        setCategorias(data.categoria_recetas || []);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setCategorias([]); // Si hay error, asignamos un array vacío
      }
    };

    fetchCategorias();




  }, []); // El array vacío asegura que solo se ejecute una vez, al montar el componente

  const indexOfLastCategory = (currentPage + 1) * categoriasPorPagina;
  const indexOfFirstCategory = indexOfLastCategory - categoriasPorPagina;

  // Filtrar las categorías solo por nombre
  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener las categorías que se mostrarán en la página actual
  const currentCategorias = filteredCategorias.slice(indexOfFirstCategory, indexOfLastCategory);

  // Calcular el número total de páginas
  const pageCount = Math.ceil(filteredCategorias.length / categoriasPorPagina);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const llamar = (event) => {
    alert(localStorage.getItem('id'));
  };




  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Listado de Categorías</h1>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <br />
        <div>
          {/* BOTON DEL MODAL */}
          <button type="button" class="btn btn-primary m-2" data-bs-toggle="modal" data-bs-target="#Agregar">
            Agregar
          </button>

        </div>

      </div>

      <div className="row">

        {currentCategorias.length > 0 ? (
          currentCategorias.map((categoria) => (
            <div className="col-md-3 mb-4" key={categoria.id_categoria_recetas}>
              <Card className="h-100 d-flex justify-content-center align-items-center">
                <Card.Body className="text-center">

                  <div className="d-flex justify-content-center">

                    {/* Icono para representar la categoría */}
                    <AiOutlineReconciliation size={80} color="#007bff" />

                  </div>

                  {/* Mostramos el nombre de la categoría */}
                  <Card.Title>{categoria.nombre}</Card.Title>

                  {/* Mostramosla descripción de la categoría */}
                  <Card.Text>{categoria.descripcion}</Card.Text>

                  <div className="d-flex justify-content-center">

                    {/* Botón "Ver más" */}
                    <Button variant="success" onClick={llamar}>Ver más</Button>
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

      {/* MODAL AGREGAR */}
      <div class="modal fade" id="Agregar" tabindex="-1" aria-labelledby="AgregarLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="AgregarlLabel">Modal title</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Categoria_recetas;
