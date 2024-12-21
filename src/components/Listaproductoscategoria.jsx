import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import { Pagination } from 'react-bootstrap';
import { API_BASE_URL } from '../url';
import Registrarproductos from './Registrarproductos';
import { Button } from "../components/ui/button";
import { Plus, RefreshCw } from 'lucide-react';
import MdActializarproducto from './MdActializarproducto';
import Ingresoproductos from './Ingresoproducto';
import { X } from 'lucide-react';
import Mdinformacionproductos from './Mdinformacionproductos';
import '../styles/Perfil/perfil.css';


export default function Listaproductoscategoria({ isOpen, setIsOpen, categoria }) {
  const [productos, setProductos] = useState([]);
  const [productoseleccionado, setProductoseleccionado] = useState([]);
  const tableRef = useRef(null);
  const [isOpens, setIsOpens] = useState(false);
  const [isOpeningreso, setIsOpeningreso] = useState(false);
  const [isOpenupdate, setIsOpenupdate] = useState(false);
  const [isOpeninfoproducto, setIsOpeninfoproducto] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Filtro por nombre
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage] = useState(3); // Número de productos por página

  const agregarstock = (producto) => {
    setIsOpeningreso(true);
    setProductoseleccionado(producto);
  };

  const updateproducto = (producto) => {
    setIsOpenupdate(true);
    setProductoseleccionado(producto);
  };

  const infoproducto = (producto) => {
    setIsOpeninfoproducto(true);
    setProductoseleccionado(producto);
  };

  const add = (categoria) => {
    setIsOpens(true);
  };

  const agregarProducto = (nuevoProducto) => {
    setProductos((prev) => [...prev, nuevoProducto]);
  };

  const ActualizarProducto = (nuevoProducto) => {
    alert(nuevoProducto.id_producto)
    setProductos((prev) => 
      prev.map((producto) =>
        producto.id_producto === nuevoProducto.id_producto ? nuevoProducto : producto
      )
    );
  };


  const ingresoProducto = (nuevoProducto) => {
    alert(nuevoProducto.id_producto)
    setProductos((prev) => 
      prev.map((producto) =>
        producto.id_producto === nuevoProducto.id_producto ? nuevoProducto : producto
      )
    );
  };

  const fetchProductos = async () => {
    try {
      if (!categoria?.id_categoria_pro) return;
      const response = await fetch(`${API_BASE_URL}/productoscategoria/${categoria.id_categoria_pro}`);
      const data = await response.json();
      setProductos(data.productos || []);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      alert('No se pudo cargar la información.');
      setProductos([]);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [categoria?.id_categoria_pro]);

  const filteredProducts = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const numeropaginaciones = Math.ceil(filteredProducts.length / itemsPerPage);




  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-6xl"
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white rounded-t-lg relative">
              <h2 className="text-3xl font-semibold mb-3">Categorías de productos</h2>
              <p className="text-sm opacity-80">Consulta las categorías registradas para preparar recetas</p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors absolute top-4 right-4"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex justify-between p-3 filtropr">
              <input
                type="text"
                className="border p-2 rounded-lg w-1/3"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn btn-success btn-sm py-2 px-4 rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300"
                onClick={() => {
                  setIsOpens(true);
                  add(categoria);
                }}
                title="Agregar Producto"
              >
                <i className="fas fa-plus mr-2"> Agregar</i>
              </button>
            </div>
            <div className="p-6 mx-5 bg-gray-50 rounded-lg shadow-lg border border-gray-300 overflow-hidden">
              <table
                ref={tableRef}
                className="table table-striped table-bordered table-hover w-full border-collapse rounded-lg"
              >
                <thead className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                  <tr>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Fecha de Registro</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((producto) => (
                    <tr key={producto.id_producto} className="hover:bg-gray-100 transition-colors duration-300">
                      <td>
                        <img
                          src={`data:image/png;base64,${producto.foto}`}
                          alt={`Foto de ${producto.nombre}`}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            backgroundColor: '#f5f5f6',
                          }}
                          className="w-12 h-12 shadow-md"
                        />
                      </td>
                      <td>{producto.nombre}</td>
                      <td>{producto.descripcion.length > 10 ? `${producto.descripcion.substring(0, 15)}...` : producto.descripcion}</td>
                      <td>{producto.stock}</td>
                      <td>{new Date(producto.created_at).toLocaleDateString('es-ES')}</td>
                      <td>
                        {(() => {
                          let claseEstado = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";
                          let textoEstado = "";

                          if (producto.estado === false) {
                            claseEstado += "bg-red-100 text-gray-800";
                            textoEstado = "Inactivo";
                          } else {
                            claseEstado += "bg-green-100 text-green-800";
                            textoEstado = "Activo";
                          }

                          return (
                            <span className={claseEstado}>
                              {textoEstado}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="flex space-x-2">
                        <Button
                          onClick={() => {
                            setIsOpeningreso(true);
                            agregarstock(producto);
                          }}
                          className="w-32 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200"
                        >
                          <Plus className="mr-2 h-4 w-4" /> Movimientos
                        </Button>
                        <Button
                          onClick={() => {
                            setIsOpenupdate(true);
                            updateproducto(producto);
                          }}
                          variant="outline"
                          className="w-32 text-gray-700 border-gray-300 hover:border-gray-500 hover:text-gray-900 rounded-lg transition duration-200"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" /> Actualizar
                        </Button>
                        <Button
                          onClick={() => {
                            setIsOpeninfoproducto(true);
                            infoproducto(producto);
                          }}
                          variant="outline"
                          className="w-32 text-gray-700 border-gray-300 hover:border-gray-500 hover:text-gray-900 rounded-lg transition duration-200"
                        >
                          Info producto
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>



            <div className="flex justify-center items-center p-4 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-pink-300 text-white rounded-lg hover:bg-pink-800 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: numeropaginaciones }, (_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      className={`px-3 py-2 rounded-lg ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} hover:bg-blue-500 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed`}
                      onClick={() => paginate(page)}
                      disabled={page === currentPage}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>


              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage * itemsPerPage >= filteredProducts.length}
                className="px-4 py-2 bg-orange-300 text-white rounded-lg
                hover:bg-orange-800 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>





            <div className="flex p-3 justify-end mt-4">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="w-32 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Cerrar
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Otros modales */}
      {isOpens && Registrarproductos && (
        <Registrarproductos
          isOpen={isOpens}
          setIsOpen={setIsOpens}
          categoria={categoria}
          onNuevoProducto={agregarProducto}
        />
      )}

      {isOpenupdate && MdActializarproducto && (
        <MdActializarproducto
          isOpen={isOpenupdate}
          setIsOpen={setIsOpenupdate}
          producto={productoseleccionado} 
          updateProducto={ActualizarProducto}
        />
      )}

      {isOpeningreso && Ingresoproductos && (
        <Ingresoproductos
          isOpen={isOpeningreso}
          setIsOpen={setIsOpeningreso}
          producto={productoseleccionado} 
          ingresoProducto={ingresoProducto}
        />
      )}

      {isOpeninfoproducto && Mdinformacionproductos && (
        <Mdinformacionproductos
          isOpen={isOpeninfoproducto}
          setIsOpen={setIsOpeninfoproducto}
          producto={productoseleccionado} // Pasamos el producto
        />
      )}
    </div>
  );
}
