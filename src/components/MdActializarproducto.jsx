import React, { useEffect, useState } from 'react';
import { motion } from './framer-motion/motion';
import { Modal, Button, Form } from "react-bootstrap";
import Swal from 'sweetalert2';  // Importar SweetAlert2

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { API_BASE_URL } from '../url';
import { Switch } from './ui/Switch';
import { X } from 'lucide-react';
import Generador_de_codigo from '../QR/Generador_de_codigo';
import MdAgregarUnidadMedida from './MdAgregarUnidadMedida';

export default function MdActializarproducto({ isOpen, setIsOpen, producto, updateProducto }) {
  
  const [isOpeninunidad_medida, setIsOpenunidad_medida] = useState(false);
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

  const [isOpenGenerador, setIsOpenGenerador] = useState(null);
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
          imagenBase64: reader.result.split(',')[1],
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
        foto: formData.imagenBase64 || producto.foto,
      });
      setImage(producto.imagenBase64 ? `${API_BASE_URL}/images/${producto.imagenBase64}` : null);
    }
  }, [producto]);

  const agregarUnidadMedida = (nuevaUnidad) => {
    setunidad_medida((prev) => [...prev, nuevaUnidad]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${producto.id_producto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foto: formData.imagenBase64 || producto.foto,
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          id_unidad_medida: formData.id_unidad_medida,
          id_usuario: id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        // Mostrar Toast de éxito
        Swal.fire({
          title: 'Producto actualizado con éxito!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        updateProducto(result.message);
        setIsOpen(false);
      } else {
        throw new Error('Error al actualizar el producto');
      }
    } catch (error) {
      // Mostrar Toast de error
      Swal.fire({
        title: 'Error',
        text: error.message || 'Hubo un problema al actualizar el producto.',
        icon: 'error',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      console.error('Error:', error);
    }
  };

  const unidad_medida_modal = () => {
    setIsOpenunidad_medida(true);
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
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-4 text-white relative">
              <h2 className="text-xl font-bold mb-1">Actualizar Producto con codigo #{producto.id_producto}</h2>
              <p className="text-xs opacity-80">Actualiza según tus preferencias</p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors absolute top-2 right-2"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <Form.Group controlId="formEstado" className="">
                
                <Form.Check
                  type="switch"
                  id="estado-switch"
                  label={isOpenGenerador ? "Subir foto desde el celular" : "Elegir Foto"}
                  checked={isOpenGenerador}
                  onChange={() => setIsOpenGenerador(!isOpenGenerador)}
                />
              </Form.Group>

              {isOpenGenerador === true ? (
                <div className="form-group me-3 mb-0">
                  <Generador_de_codigo
                    id_producto={producto.id_producto}
                    id_usuario={id}
                    route={"productos"}
                  />
                </div>
              ) : (
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
              )}

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

              <div className="form-group mb-4">
                <label>Unidad de Medida </label>
                <div className="d-flex align-items-center">
                  <select
                    name="id_unidad_medida"
                    value={formData.id_unidad_medida}
                    onChange={(e) => setFormData({ ...formData, id_unidad_medida: e.target.value })}
                    className="form-control"
                  >
                    <option value="">Seleccionar unidad</option>
                    {unidad_medida.map((unidad) => (
                      <option key={unidad.id_unidad_medida} value={unidad.id_unidad_medida}>
                        {unidad.nombre_unidad}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => {
                      setIsOpenunidad_medida(true);
                      unidad_medida_modal();
                    }}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </div>
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
                  Actualizar
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
