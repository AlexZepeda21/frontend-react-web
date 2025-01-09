import React, { useState } from 'react'
import { motion } from './framer-motion/motion'
import { Button } from 'react-bootstrap'
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { API_BASE_URL } from '../url'
import Swal from 'sweetalert2'  // Import SweetAlert2

export default function MdAgregarCateproductos({agregarcategoria}) {
  const [image, setImage] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          imagenBase64: reader.result.split(',')[1],
        }));
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    foto:''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/cate_pro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_categoria: formData.nombre,
          descripcion: formData.descripcion,
          foto: formData.imagenBase64 || "Agrege una foto",
        }),
      })

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Categoría creada',
          text: 'La categoría de receta se ha creado con éxito!',
          toast: true,  // Hacer que sea una notificación tipo toast
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación en milisegundos
        });
        agregarcategoria(result.message)
        setIsOpen(false)
      } else {
        throw new Error('El nombre de la categoria no puede repetirse')
      }
    } catch (error) {
      console.error('Error:', error)
      // Reemplazamos el alert con SweetAlert2 para mostrar el error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        toast: true,  // Hacer que sea una notificación tipo toast
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación en milisegundos
      });
    }
  }

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Agregar Categoria de productos</Button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg"
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white rounded-t-lg">
              <h2 className="text-2xl font-bold mb-2">Nueva Categoría de productos</h2>
              <p className="text-sm opacity-80">Añade una nueva categoría de productos para preparar deliciosas recetas</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <label className="image-upload">
                {image ? (
                  <img
                    src={image}
                    alt="Previsualización de imagen"
                    className="upload-preview"
                  />
                ) : (
                  <span className="upload-placeholder text-center">Subir Imagen</span>
                )}
                <input
                  type="file"
                  className="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-lg font-medium">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  placeholder="Ej: Verduras"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-lg font-medium">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  placeholder="Ej: Verduras frescos"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                  Guardar Categoría
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
