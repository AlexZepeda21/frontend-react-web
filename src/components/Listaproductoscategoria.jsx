'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import $ from 'jquery';
import { API_BASE_URL } from '../url';
import Registrarproductos from './Registrarproductos';
export default function Listaproductoscategoria({ isOpen, setIsOpen, categoria }) {
  const [productos, setProductos] = useState([]);
  const tableRef = useRef(null);
  const [isOpens, setIsOpens] = useState(false); // Aquí defines isOpen y setIsOpen
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const add = (categoria) => {
    setIsOpens(true);

  };

 

  


  // Cargar datos desde el servidor
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        if (!categoria?.id_categoria_pro) return; // Validar que exista la categoría
        const response = await fetch(`${API_BASE_URL}/productoscategoria/${categoria.id_categoria_pro}`);
        const data = await response.json();
        setProductos(data.productos || []);



      } catch (error) {
        console.error('Error al obtener los productos:', error);
        alert('No se pudo cargar la información.');
        setProductos([]);
      }
    };

    fetchProductos();
  }, [categoria?.id_categoria_pro]);

  useEffect(() => {
    if (productos.length > 0 && tableRef.current) {
      $(tableRef.current).DataTable({
        destroy: true, // Destruir la tabla previa para evitar duplicados
        responsive: true,
        paging: true,
        searching: true,
        info: true,
        pageLength: 3, // Mostrar solo 3 registros por defecto
        lengthMenu: [3, 10, 15], // Opciones para seleccionar cantidad de registros
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.5/i18n/es-ES.json", // Cargar los textos en español
        },
      });
    }
  }, [productos]);

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl" // Cambiar max-w-lg a max-w-4xl para mayor ancho
            style={{ maxHeight: '80vh', overflowY: 'auto' }} // Agregar altura máxima y scroll si el contenido excede el modal
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white rounded-t-lg">
              <h2 className="text-2xl font-bold mb-2">Categorías de productos</h2>
              <p className="text-sm opacity-80">Consulta las categorías registradas para preparar recetas</p>
            </div>
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                setIsOpen(true);
                add(categoria);
              }}
              style={{ margin: '10px 20px' }}
              title="Agregar Producto"
            >
              <i className="fas fa-plus"> Agregar</i>
            </button>



            <div className="p-6">
              {/* Tabla con DataTables */}
              <table
                ref={tableRef}
                className="table table-striped table-bordered table-hover w-100 border"
                style={{ borderRadius: '8px', overflow: 'hidden' }}
              >
                <thead className="table-dark">
                  <tr>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Fecha de Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id_producto}>
                      <td>
                        <img
                          src={`data:image/png;base64,${producto.foto}`}
                          alt={producto.nombre}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            backgroundColor: "#f5f5f6",
                          }}
                          className="w-48 h-48 object-cover rounded shadow-lg"
                        />
                      </td>
                      <td>{producto.nombre}</td>
                      <td>
                        {producto.descripcion.length > 50
                          ? producto.descripcion.substring(0, 50) + '...'
                          : producto.descripcion}
                      </td>
                      <td>{producto.stock}</td>
                      <td>
                        {new Date(producto.created_at).toLocaleDateString('en-US', {
                          mes: 'long',
                          dia: 'numeric',
                          año: 'numeric',
                        })}
                      </td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-flex justify-content-end mt-4">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

{isOpens && Registrarproductos && (
   
   <Registrarproductos
  isOpen={isOpens}
  setIsOpen={setIsOpens}
  categoria={categoria}  // Pasamos la categoría al modal
/>
 )}
    </div>
  );
}
