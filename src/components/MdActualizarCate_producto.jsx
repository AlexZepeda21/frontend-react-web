import React, { useEffect, useState } from 'react';
import { motion } from './framer-motion/motion';
import { Modal, Button, Form } from "react-bootstrap";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { API_BASE_URL } from '../url';
import { Switch } from './ui/Switch';
import Swal from 'sweetalert2';  // Importa SweetAlert2
import Generador_de_codigo from '../QR/Generador_de_codigo';


export default function MdActualizarCate_producto({ isOpen, setIsOpen, categoria, actualizarcate }) {
  const [formData, setFormData] = useState({
    nombre_categoria: '',
    descripcion: '',
    foto: '',
    estado: false,
  });

    const [isOpenGenerador, setIsOpenGenerador] = useState(null);
  
  const [image, setImage] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1]; // Extraemos solo el base64
        setFormData((prevData) => ({
          ...prevData,
          foto: base64Image, // Asegúrate de usar "foto"
        }));
        setImage(reader.result); // Para la previsualización
      };
      reader.readAsDataURL(file); // Leer el archivo como URL base64
    }
  };

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre_categoria: categoria.nombre_categoria,
        descripcion: categoria.descripcion,
        estado: categoria.estado || false,  // Asegúrate de que "estado" exista en la categoría
      });
    }
  }, [categoria]);



  const id = localStorage.getItem('id'); // Obtener el id de usuario del localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/cate_pro/${categoria.id_categoria_pro}`, {
        method: 'PUT',  // Usamos PUT para la actualización
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Categoría actualizada',
          text: 'La categoría de receta se ha actualizado con éxito!',
        });
        actualizarcate(result.message);
        setIsOpen(false);  // Cerrar modal al guardar
      } else {
        throw new Error('Error al actualizar la categoría');
      }
    } catch (error) {
      console.error('Error:', error);
      // Usamos SweetAlert2 para mostrar el mensaje de error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al actualizar la categoría',
      });
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center ">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg"
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white rounded-t-lg">
              <h2 className="text-2xl font-bold mb-2">Actualizar esta categoría de productos</h2>
              <p className="text-sm opacity-80">Actualiza según tus preferencias</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Form.Group controlId="formEstado" className="">
            <Form.Label className="me-3 mb-0">Estado</Form.Label>
            <Form.Check
              type="switch"
              id="estado-switch"
              label={isOpenGenerador ? "Subir foto dede el celular" : "Elegir Foto"}
              checked={isOpenGenerador}
              onChange={() => setIsOpenGenerador(!isOpenGenerador)}
            />
            </Form.Group>

            { isOpenGenerador === true ? (
                <div className="form-group me-3 mb-0">
                 <Generador_de_codigo
                    id_producto= {categoria.id_categoria_pro}
                    id_usuario = {id}
                    route = {"cate_pro"}
                  />
                 </div>
              ):(
                <div className="form-group">
                <label className="image-upload">
                  {image || categoria.foto ? (
                    <img
                      src={image ? image : `data:image/png;base64,${categoria.foto}`}
                      alt="Previsualización de imagen"
                      className="upload-preview w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <span className="upload-placeholder text-center text-sm">Subir Imagen</span>
                  )}
                  <input
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              )
            }
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-lg font-medium">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre_categoria}
                  onChange={(e) => setFormData({ ...formData, nombre_categoria: e.target.value })}
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
                <Label htmlFor="estado" className="text-lg font-medium">
                  {formData.estado ? "Activo" : "Inactivo"}
                </Label>
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
