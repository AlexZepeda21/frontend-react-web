import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { AiOutlineReconciliation } from "react-icons/ai";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { API_BASE_URL } from '../url';
import { useNavigate } from 'react-router-dom';
 
// Importamos el modal personalizado
import MdAgregarCateproductos from '../components/MdAgregarCatepro';
import MdActualizarCate_producto from '../components/MdActualizarCate_producto';
import Registrarproductos from '../components/registrarproductos';


const Categoria_productos = () => {
  const [categorias, setCategorias] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [categoriasPorPagina, setCategoriasPorPagina] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Aquí defines isOpen y setIsOpen
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null); // Estado para guardar la categoría seleccionada
  const [isOpens, setIsOpens] = useState(false); // Aquí defines isOpen y setIsOpen


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cate_pro`);
        const data = await response.json();
        setCategorias(data.categorias_productos || []); // Asegúrate de que sea un array
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setCategorias([]); // Si hay error, asignamos un array vacío
      }
    };

    fetchCategorias();
  }, []);

  const indexOfLastCategory = (currentPage + 1) * categoriasPorPagina;
  const indexOfFirstCategory = indexOfLastCategory - categoriasPorPagina;

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre_categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCategorias = filteredCategorias.slice(indexOfFirstCategory, indexOfLastCategory);
  const pageCount = Math.ceil(filteredCategorias.length / categoriasPorPagina);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Función para abrir el modal y cargar la categoría seleccionada
  const openUpdateModal = (categoria) => {
    setCategoriaSeleccionada(categoria);  // Al seleccionar la categoría, la guardamos en el estado
    setIsOpen(true);  // Abrimos el modal
  };

  const openproductcateg = (categoria) => {
    setCategoriaSeleccionada(categoria);  // Al seleccionar la categoría, la guardamos en el estado
    setIsOpens(true);  // Abrimos el modal
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Listado de Categorías de productos</h1>

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
        {/* Aquí está el modal personalizado que llamamos desde otro archivo */}
        <div>
          <MdAgregarCateproductos isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

      </div>

      <div className="row">
        {currentCategorias.length > 0 ? (
          currentCategorias.map((categoria) => (
            <div className="col-md-3 mb-4" key={categoria.id_categoria_pro}>
              <Card className="h-100 d-flex justify-content-center align-items-center">
                <Card.Body className="text-center">
                  <div className="d-flex justify-content-center">
                  <img
                      src={`data:image/png;base64,${categoria.foto}`}
                      alt="Imagen del producto"
                      style={{
                        width: "250px",
                        height: "175px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        backgroundColor: "#f5f5f6",
                      }}/>
                  </div>

                  {/* Mostramos el nombre de la categoría */}
                  <Card.Title>
                    {categoria.nombre_categoria}
                  </Card.Title>

                  {/* Mostramos la descripción de la categoría */}
                  <Card.Text>{categoria.descripcion}</Card.Text>

                  <div className="d-flex justify-content-center">
                    {/* Al hacer clic en el botón de "Actualizar", se pasa la categoría seleccionada */}
                    <Button
                      onClick={() => openUpdateModal(categoria)} // Abrimos el modal y pasamos la categoría
                      className="btn btn-primary"
                    >
                      Actualizar
                    </Button>

                    <Button
                      onClick={() => openproductcateg(categoria)} // Abrimos el modal y pasamos la categoría
                      className="btn btn-primary"
                    >
                      Ver
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

      {/* Modal de actualización, pasamos la categoría seleccionada */}
      {isOpen && MdActualizarCate_producto && (
        <MdActualizarCate_producto
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          categoria={categoriaSeleccionada}  // Pasamos la categoría al modal
        />
      )}


{isOpens && Registrarproductos && (
        <Registrarproductos
          isOpen={isOpens}
          setIsOpen={setIsOpens}
          categoria={categoriaSeleccionada}  // Pasamos la categoría al modal
        />
      )}
    </div>
  );
};

export default Categoria_productos;