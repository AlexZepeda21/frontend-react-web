import React, { useEffect, useState } from 'react';
import { motion } from './framer-motion/motion';
import { Button } from 'react-bootstrap';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { API_BASE_URL } from '../url';
import { Switch } from './ui/Switch';

export default function MdActializarproducto({ isOpen, setIsOpen, producto }) {
  const [formData, setFormData] = useState({
    nombre_unidad: "",
    id_unidad_medida: "",
    descripcion: "",
    id_usuario: "",
    id_categoria_pro: "",
    foto: '',
    imagenBase64: '',
    nombre: '',
    estado: false,
  });


  const [image, setImage] = useState(null);
  const [catepro, setcatepro] = useState([]);
  const [unidad_medida, setunidad_medida] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          foto: reader.result.split(',')[1],
        }));
        setImage(reader.result); // Mostrar previsualización de la imagen
      };
      reader.readAsDataURL(file);
    }
  };

  const id = localStorage.getItem('id'); // Obtener el id de usuario del localStorage


  useEffect(() => {
    

    const fetchUnidadesMedida = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/listasolounidademedia1`);
        const data = await response.json();
        setunidad_medida(data.unidad_medida || []);
      } catch (error) {
        console.error('Error al obtener las unidades de medida:', error);
        setunidad_medida([]);
      }
    };

    fetchUnidadesMedida();
  }, []);

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        id_unidad_medida: producto.id_unidad_medida || "",
        id_usuario: id,
        estado: producto.estado || false,
        foto: producto.imagenBase64 || producto.foto,

      
      });
      setImage(producto.imagenBase64 ? `${API_BASE_URL}/images/${producto.imagenBase64}` : null);
    }
  }, [producto]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${producto.id_producto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Producto actualizado con éxito!');
        setIsOpen(false);
      } else {
        throw new Error('Error al actualizar el producto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg"
            style={{ maxHeight: '60vh', overflowY: 'auto' }}
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-4 text-white">
              <h2 className="text-xl font-bold mb-1">Actualizar Producto</h2>
              <p className="text-xs opacity-80">Actualiza según tus preferencias</p>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div className="form-group">
                <label className="image-upload">
                  {image || producto.foto ? (
                    <img
                      src={image ? image : `data:image/png;base64,${producto.foto}`}
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

              <div className="form-group">
                <label className="text-sm">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del producto"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="form-control text-sm"
                />
              </div>

              <div className="form-group flex-1">
                <label>Unidad de Medida</label>
                <select
                  name="id_unidad_medida"
                  value={formData.id_unidad_medida || ""}
                  onChange={(e) => setFormData({ ...formData, id_unidad_medida: e.target.value })}
                  className="form-control text-sm"
                >
                  <option value="">Seleccionar unidad</option>
                  {unidad_medida.map((unidad) => (
                    <option key={unidad.id_unidad_medida} value={unidad.id_unidad_medida}>
                      {unidad.nombre_unidad}
                    </option>
                  ))}
                </select>
              </div>



              <div className="form-group">
                <label className="text-sm">Descripción</label>
                <textarea
                  name="descripcion"
                  placeholder="Describe el producto..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="form-control text-sm"
                  style={{ resize: 'vertical', minHeight: '80px' }}
                ></textarea>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="estado"
                  checked={formData.estado}
                  onCheckedChange={(checked) => setFormData({ ...formData, estado: checked })}
                />
                <Label htmlFor="estado" className="text-sm font-medium">Activo</Label>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="text-sm">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white text-sm"
                >
                  Guardar Producto
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>

  );
}
