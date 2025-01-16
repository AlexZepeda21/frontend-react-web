import React, { useEffect, useState, useCallback } from 'react';
import { motion } from './framer-motion/motion';
import { Button, Form } from 'react-bootstrap';
import { API_BASE_URL } from '../url';
import Generador_de_codigo from '../QR/Generador_de_codigo';
import { Switch } from './ui/Switch';
import Swal from 'sweetalert2'  // Import SweetAlert2

const ImageUploader = ({ categoria, image, handleFileChange }) => (
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
);

export default function MdActualizarCateRecetas({ isOpen, setIsOpen, categoria }) {
  const id = localStorage.getItem('id');
  const [image, setImage] = useState(null);
  const [isOpenGenerador, setIsOpenGenerador] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: false,
    imagenBase64: '',
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        foto: categoria.foto,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        estado: categoria.estado || false,
      });
    }
  }, [categoria]);

  // File change handler with validation
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen.');
        return;
      }
      if (file.size > 5000000) {
        alert('El archivo es demasiado grande. Elige una imagen de menos de 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          imagenBase64: reader.result.split(',')[1],
        }));
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {};

    // Update only the changed fields
    if (formData.nombre !== categoria.nombre) updatedData.nombre = formData.nombre;
    if (formData.descripcion !== categoria.descripcion) updatedData.descripcion = formData.descripcion;
    if (formData.estado !== categoria.estado) updatedData.estado = formData.estado;
    if (formData.imagenBase64 && formData.imagenBase64 !== categoria.foto) updatedData.foto = formData.imagenBase64;

    if (Object.keys(updatedData).length === 0) {
      Swal.fire({
        icon: 'question',
        title: 'No ha realizado ningun cambio',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación (en milisegundos)
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cate_recetas/${categoria.id_categoria_recetas}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        // Mostrar la notificación de éxito
        Swal.fire({
          icon: 'success',
          title: 'Receta actualizada',
          text: 'Espere a que se reinicie el navegador',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,  // Duración de la notificación (en milisegundos)
        });

        // Después de 2 segundos, recargar la página
        setTimeout(() => {
          window.location.reload();
        }, 1000); // 2000 milisegundos = 2 segundos

        setIsOpen(false);
      } else {
        const data = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Verifica los datos que estas enviando',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación (en milisegundos)
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la respuesta del servidor',
        text: 'Estas agregando un campo invalido o no estas conectado a la red de itca',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación (en milisegundos)
      });
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full"
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Actualizar esta categoría de receta</h2>
              <p className="text-sm opacity-80">Actualiza según tus preferencias</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
              <Form.Group controlId="formEstado">
                <Form.Label className="me-3 mb-0">Estado</Form.Label>
                <Form.Check
                  type="switch"
                  id="estado-switch"
                  label={isOpenGenerador ? 'Subir foto desde el celular' : 'Elegir Foto'}
                  checked={isOpenGenerador}
                  onChange={() => setIsOpenGenerador(!isOpenGenerador)}
                />
              </Form.Group>

              {isOpenGenerador ? (
                <div className="form-group me-3 mb-0">
                  <Generador_de_codigo
                    id_producto={categoria.id_categoria_recetas}
                    id_usuario={id}
                    route="cate_recetas"
                  />
                </div>
              ) : (
                <ImageUploader categoria={categoria} image={image} handleFileChange={handleFileChange} />
              )}

              <div className="space-y-2">
                <label htmlFor="nombre" className="text-lg font-medium">Nombre</label>
                <input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  placeholder="Ej: Postres"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="descripcion" className="text-lg font-medium">Descripción</label>
                <textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  placeholder="Ej: Recetas para hacer postres"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="estado" className="text-lg font-medium">Activo</label>
                <Switch
                  id="estado"
                  checked={formData.estado}
                  onCheckedChange={(checked) => setFormData({ ...formData, estado: checked })}
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
  );
}
