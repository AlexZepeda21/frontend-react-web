
import React, { useEffect, useState } from 'react';
import { motion } from './framer-motion/motion'
import { Button } from 'react-bootstrap'
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { API_BASE_URL } from '../url'

export default function Mdinformacionproductos({ isOpen, setIsOpen, producto }) {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        estado: false,
      });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        estado: producto.estado || false,  
      });
    }
  }, [producto]);


  

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white rounded-lg shadow-xl w-full max-w-lg"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white rounded-t-lg">
        <h2 className="text-2xl font-bold mb-1">{producto.nombre}</h2>
        <p className="text-sm opacity-80">Detalles del producto</p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {/* Imagen del producto */}
        {producto.foto && (
          <div className="flex justify-center mb-4">
            <img
              src={`data:image/png;base64,${producto.foto}`}
              alt={producto.nombre}
              style={{
                width: "450px",       
                height: "175px",      
                objectFit: "contain",
                borderRadius: "8px",  
                backgroundColor: "#f5f5f6", 
              }}
              className="w-48 h-48 object-cover rounded shadow-lg"
            />
          </div>
        )}
        {/* Información general */}
        <div className="space-y-2">
          <p className="text-lg font-medium">
            <strong>Descripción:</strong> {producto.descripcion}
          </p>
          <p className="text-lg">
            <strong>En almacen:</strong> {producto.stock}
          </p>
          <p className="text-lg">
            <strong>Unidad de medida:</strong> {producto.unidad_medida}
          </p>
          
          <p className="text-lg">
            <strong>Categoría:</strong> {producto.categoria}
          </p>
          <p className="text-lg">
            <strong>Usuario:</strong> {producto.usuario}
          </p>
          <p className={`text-lg font-semibold ${producto.estado ? "text-green-600" : "text-red-600"}`}>
            Estado: {producto.estado ? "Activo" : "Inactivo"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-2 p-4 border-t">
        <Button variant="outline-danger" onClick={() => setIsOpen(false)}>
          Cerrar
        </Button>
      </div>
    </motion.div>
  </div>
  )
}
