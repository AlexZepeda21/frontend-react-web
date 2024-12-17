import React, { useEffect, useState } from 'react';
import { motion } from './framer-motion/motion';
import { Button } from 'react-bootstrap';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { API_BASE_URL } from '../url';
import { Switch } from './ui/Switch';

export default function MdActualizarCateRecetas({ isOpen, setIsOpen, categoria }) {
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: false,
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        estado: categoria.estado || false,  // Asegúrate de que "estado" exista en la categoría
      });
    }
  }, [categoria]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/cate_recetas/${categoria.id_categoria_recetas}`, {
        method: 'PUT',  // Usamos PUT para la actualización
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });


      if (response.ok) {
        alert('Categoría de receta actualizada con éxito!');
        window.location.reload();
        setIsOpen(false);  // Cerrar modal al guardar
      } else {
        throw new Error('Error al actualizar la categoría');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al actualizar la categoría');
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full"
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Actualizar esta categoría de receta</h2>
              <p className="text-sm opacity-80">Actualiza según tus preferencias</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-lg font-medium">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  placeholder="Ej: Postres"
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
                  placeholder="Ej: Recetas para hacer postres"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="estado"
                  checked={formData.estado}
                  onCheckedChange={(checked) => setFormData({ ...formData, estado: checked })}
                />
                <Label htmlFor="estado" className="text-lg font-medium">Activo</Label>
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
);
}