import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { AiOutlineReconciliation } from "react-icons/ai";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { API_BASE_URL } from '../url';
import { useNavigate } from 'react-router-dom';
import "../styles/productos/cardcategorias_pro.css";
import '../styles/Perfil/unidades.css';
import Salidaproductos from '../components/salidaproductos';

const Productos_vencidos_por_vencer = () => {
  const [categorias, setCategorias] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [categoriasPorPagina, setCategoriasPorPagina] = useState(4); // Número de categorías por página
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [ingresoSeleccionada, setIngresoSeleccionada] = useState(null);
 

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/vencidos`);
        const data = await response.json();
        console.log('Datos de la API:', data);
        setCategorias(data.message || []);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setCategorias([]);
      }
    };

    fetchCategorias();
  }, []);

  // Cálculo de los índices de las categorías para la paginación
  const indexOfLastCategory = (currentPage + 1) * categoriasPorPagina;
  const indexOfFirstCategory = indexOfLastCategory - categoriasPorPagina;

  // Filtrar las categorías según el término de búsqueda
  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extraer las categorías que corresponden a la página actual
  const currentCategorias = filteredCategorias.slice(indexOfFirstCategory, indexOfLastCategory);

  // Calcular el número total de páginas
  const pageCount = Math.ceil(filteredCategorias.length / categoriasPorPagina);

  // Manejar el cambio de página
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const salida=(id_ingreso)=>{
    setIsOpen(true); 
    setIngresoSeleccionada(id_ingreso); 
  }

  return (
    <div className="container di mt-5">
      <h1 className="text-3xl titulo font-bold tracking-tight">Productos por vencerse o vencidos</h1>
      <p className="titulo font-bold tracking-tight">Retire los productos proximos a vencer o vencidos para  tener un mejor control del inventario</p>
      <div className="mb-4">
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Buscar categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <br />
      </div>

      <div className="row">
        {currentCategorias.length > 0 ? (
          currentCategorias
          .sort((a, b) => b.cantidad_productos - a.cantidad_productos) 
          .map((categoria) => (     
            <div className="col-md-3 mb-4 " key={categoria.id_ingreso}>
              <div class="width-250px bg-white rounded-lg shadow-md overflow-hidden">
                <div class="p-3">
                  <div class="flex justify-between items-center mb-3">
                    <h2 class="text-sm font-medium text-gray-700">
                      {categoria.nombre} {categoria.id_ingreso}
                    </h2>
                  </div>
                {/*id del producto categoria.id_producto */}

                  <div class="relative w-full height-150px mb-3">
                    <img
                    style={{
                      width: "450px",       
                      height: "70px",      
                      objectFit: "contain",
                    }}
                      src={`data:image/png;base64,${categoria.foto}`}
                      alt={categoria.nombre}
                      class="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div class="flex justify-between items-center ">
                    <h2 class="text-sm font-medium text-gray-700">
                        
                      Fecha Vencimineto: {new Date(categoria.fecha_vencimiento).toLocaleDateString('es-ES')}
                    </h2>
                  </div>
                  <div class="flex justify-between items-center ">
                    <h2 class="text-sm font-medium text-gray-700">
                      Fecha de ingreso :{new Date(categoria.fecha_ingreso).toLocaleDateString('es-ES')}
                    </h2>
                  </div>
                </div>
                <div class="flex gap-1 p-3 bg-gray-100">
                <button class="flex-1 bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300 transition-colors"
                    onClick={() => salida(categoria.id_ingreso)} // Abrimos el modal y pasamos la categoría
                  >
                    Movimiento
                  </button>      
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No hay productos por vencerse</p>
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

      {isOpen && Salidaproductos && (
          <Salidaproductos
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                id_ingreso={ingresoSeleccionada}
                categoriascontproducto={salida}
            />
        )}
    </div>
  );
};

export default Productos_vencidos_por_vencer;
