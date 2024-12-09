'use client'

import React, { useState, useEffect } from 'react'
import { motion } from './framer-motion/motion'
import { Button, Table } from 'react-bootstrap'
import { API_BASE_URL } from '../url'

export default function Registrarproductos({ isOpen, setIsOpen }) {
  const [data, setData] = useState([])

  // Cargar datos desde el servidor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cate_pro`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error fetching data:', error)
        alert('Error al cargar los datos')
      }
    }
    fetchData()
  }, [])

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
              {/* Tabla de Bootstrap */}
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.nombre_categoria}</td>
                        <td>{item.descripcion}</td>
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
              </Table>

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
