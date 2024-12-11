import React, { useState } from 'react';
import { motion } from './framer-motion/motion';
import { Button } from 'react-bootstrap';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { API_BASE_URL } from '../url';

export default function MdAgregarRecetas({ setShowModal }) {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Convertir la imagen a base64 y almacenarla en el estado
        setFormData((prevData) => ({
          ...prevData,
          imagenBase64: reader.result.split(',')[1], // Extraemos solo la parte base64 de la URL
        }));
      };
      reader.readAsDataURL(file); // Leer el archivo como URL base64
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
    id_usuario: localStorage.getItem("id"),  // Usuario de localStorage
    id_categoria_recetas: localStorage.getItem("id_categoria_recetas"),  // id de la categoría seleccionada
    nombre_receta: '',
    descripcion: '',
    tiempo_preparacion: '',
    numero_porciones: '',
    dificultad: '',  
    foto: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/recetas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: formData.id_usuario,
          id_categoria_recetas: formData.id_categoria_recetas,  // Enviar el id de la categoría seleccionada
          nombre_receta: formData.nombre_receta,
          descripcion: formData.descripcion,
          tiempo_preparacion: formData.tiempo_preparacion,
          numero_porciones: formData.numero_porciones,
          dificultad: formData.dificultad,
          foto: formData.imagenBase64,
        }),
      });
      if (response.ok) {
        alert('Receta creada con éxito!');
        setShowModal(false);
      } else {
        throw new Error('Error al crear la receta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-lg"
        >
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white rounded-t-lg">
            <h2 className="text-2xl font-bold mb-2">Nueva Receta</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
            <label className="image-upload">
              {image ? (
                <img
                  src={image}
                  alt="Previsualización de imagen"
                  className="upload-preview"
                />
              ) : (
                <span className="upload-placeholder text-center">Click aquí para subir imagen</span>
              )}
              <input
                type="file"
                className="file-input"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>

            <div className="space-y-2">
              <Label htmlFor="nombre_receta" className="text-lg font-medium">Nombre de la Receta</Label>
              <Input
                id="nombre_receta"
                value={formData.nombre_receta}
                onChange={(e) => setFormData({ ...formData, nombre_receta: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                placeholder="Ej: Spaghetti Bolognese"
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
                placeholder="Ej: Delicioso spaghetti con salsa bolognesa casera."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiempo_preparacion" className="text-lg font-medium">Tiempo de Preparación (minutos)</Label>
              <Input
                id="tiempo_preparacion"
                type="number"
                value={formData.tiempo_preparacion}
                onChange={(e) => setFormData({ ...formData, tiempo_preparacion: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                placeholder="Ej: 45"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero_porciones" className="text-lg font-medium">Número de Porciones</Label>
              <Input
                id="numero_porciones"
                type="number"
                value={formData.numero_porciones}
                onChange={(e) => setFormData({ ...formData, numero_porciones: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                placeholder="Ej: 4"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dificultad" className="text-lg font-medium">Dificultad</Label>
              <select
                id="dificultad"
                value={formData.dificultad}
                onChange={(e) => setFormData({ ...formData, dificultad: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Seleccione la dificultad</option>
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit" className="bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                Guardar Receta
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
