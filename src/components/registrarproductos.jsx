'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from 'react-bootstrap'  // Solo mantengo Button de React Bootstrap para el botón
import { API_BASE_URL } from '../url'

export default function Registrarproductos({ isOpen, setIsOpen, categoria }) {
  const [productos, setProductos] = useState([]);  // Renombrado a productos

  // Cargar datos desde el servidor
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        //const response = await fetch(`${API_BASE_URL}/productos`);
        const response = await fetch(`${API_BASE_URL}/productoscategoria/${categoria.id_categoria_pro}`);
        const data = await response.json();
        setProductos(data.productos || []);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
        alert('no entro')
        setProductos([]);
      }
    };

    fetchProductos();
  }, [categoria.id_categoria_pro]);  // Dependencia añadida para actualizar cuando cambie la categoría

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg"
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white rounded-t-lg">
              <h2 className="text-2xl font-bold mb-2">Categorías de productos</h2>
              <p className="text-sm opacity-80">Consulta las categorías registradas para preparar recetas</p>
            </div>
            <div className="p-6">
              {/* Tabla simple */}
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.length > 0 ? (
                    productos.map((producto) => (
                      <tr key={producto.id_producto}>
                        <td>{producto.id_producto}</td>
                        <td>{producto.nombre}</td>
                        <td>{producto.descripcion}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No hay datos disponibles
                      </td>
                    </tr>
                  )}
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
    </div>
  )
}
