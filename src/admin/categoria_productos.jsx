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

// Importamos el modal personalizado
import MdAgregarCateproductos from '../components/MdAgregarCatepro';
import MdActualizarCate_producto from '../components/MdActualizarCate_producto';
import Listaproductoscategoria from '../components/Listaproductoscategoria';


const Categoria_productos = () => {
  const [categorias, setCategorias] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [categoriasPorPagina, setCategoriasPorPagina] = useState(4); // Modificamos el límite a 4
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Aquí defines isOpen y setIsOpen
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null); // Estado para guardar la categoría seleccionada
  const [isOpens, setIsOpens] = useState(false); // Aquí defines isOpen y setIsOpen


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cate_pro`);
        const data = await response.json();
        console.log('Datos de la API:', data);  // Verifica los datos aquí
        setCategorias(data.categorias_productos || []);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
        setCategorias([]);
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
    setIsOpens(true); 
  };

  const categoriascontproducto=(cate) => {
    cate.forEach(categorias => {
      setCategorias((prev) => 
        prev.map((categoria) =>
          categoria.id_categoria_pro === categorias.id_categoria_pro ? categorias : categoria
        )
      );
    });

  }

  const agregarcategoria=(cate) => {
    cate.forEach(categorias => {
      setCategorias((prev) => [...prev, categorias]);

    });

  }

  return (
    <div className="container di mt-5">
      <h1 className="text-3xl titulo font-bold tracking-tight">Categorias de Productos</h1>
      <p className="titulo font-bold tracking-tight">Categorice sus productos por ejemplo en verduras, frutas, Lacteos, etc</p>

<br />
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
          <MdAgregarCateproductos isOpen={isOpen} setIsOpen={setIsOpen} 
          agregarcategoria={agregarcategoria}/>
        </div>

      </div>

      <div className="row">
        {currentCategorias.length > 0 ? (
          currentCategorias
          .sort((a, b) => b.cantidad_productos - a.cantidad_productos) 
          .map((categoria) => (
            <div className="col-md-3 mb-4 " key={categoria.id_categoria_pro}>
              <div class="width-250px bg-white rounded-lg shadow-md overflow-hidden">
                <div class="p-3">
                  <div class="flex justify-between items-center mb-3">
                    <h2 class="text-sm font-medium text-gray-700">
                      {categoria.nombre_categoria}
                    </h2>
                    <span class="text-xl font-bold">{categoria.cantidad_productos}</span>
                  </div>
                  <div class="relative w-full height-150px mb-3">
                    <img
                    style={{
                      width: "450px",       
                      height: "70px",      
                      objectFit: "contain",
                    }}
                      src={`data:image/png;base64,${categoria.foto}`}
                      alt={categoria.nombre_categoria}
                      class="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </div>
                <div class="flex gap-1 p-3 bg-gray-100">
                  <button class="flex-1 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => openUpdateModal(categoria)} // Abrimos el modal y pasamos la categoría
                  >
                    Productos
                  </button>
                  <button class="flex-1 bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300 transition-colors"
                    onClick={() => openproductcateg(categoria)} // Abrimos el modal y pasamos la categoría
                  >
                    Actualizar
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

      {/* Modal de actualización, pasamos la categoría seleccionada */}
      {isOpen && Listaproductoscategoria && (
        <Listaproductoscategoria
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          categoria={categoriaSeleccionada}
          categoriascontproducto={categoriascontproducto}
        />
      )}


      {isOpens && MdActualizarCate_producto && (
        <MdActualizarCate_producto
          isOpen={isOpens}
          setIsOpen={setIsOpens}
          categoria={categoriaSeleccionada}
          actualizarcate={categoriascontproducto}
        />
      )}
    </div>
  );
};

export default Categoria_productos;
