import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../url';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import "../styles/styleproduct.css";
import { X } from 'lucide-react';
import MdAgregarUnidadMedida from './MdAgregarUnidadMedida';

export default function Registrarproductos({ isOpen, setIsOpen, categoria, onNuevoProducto, categoriaCount }) {
    const [isOpeninunidad_medida, setIsOpenunidad_medida] = useState(false);
    const [unidad_medida, setunidad_medida] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        id_unidad_medida: '',
        descripcion: '',
        foto: null,
        imagenBase64: '',
    });

    const unidad_medida_modal = () => {
        setIsOpenunidad_medida(true);
    };

    const [image, setImage] = useState(null);
    const id = localStorage.getItem('id');
    const closeModal = () => setIsOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
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
    };

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

    const agregarUnidadMedida = (nuevaUnidad) => {
        setunidad_medida((prev) => [...prev, nuevaUnidad]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    foto: formData.imagenBase64 || "Agrege una foto",
                    nombre: formData.nombre,
                    descripcion: formData.descripcion || "Agrege una Descripcion",
                    id_unidad_medida: formData.id_unidad_medida,
                    id_categoria_pro: categoria.id_categoria_pro,
                    id_usuario: id,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Ingrediente agregado a la receta',
                    text: 'Espere a que se reinicie el navegador',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                });

                onNuevoProducto(result.message);
                closeModal();

            } else {
                Swal.fire({
                    title: 'Error al registrar el producto',
                    text: result.message || 'Hubo un problema al registrar el producto.',
                    icon: 'error',
                    confirmButtonText: 'Intentar nuevamente',
                });
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            Swal.fire({
                title: 'Error al enviar los datos',
                text: 'Ocurrió un error al intentar registrar el producto.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-lg"
                style={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
                <div className="p-4 border-b border-gray-200 relative">
                    <h2 className="text-xl font-bold">Registro de Producto</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors absolute top-2 right-2"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    <div className="form-group mb-4 text-center">
                        <label className="image-upload">
                            {image ? (
                                <img
                                    src={image}
                                    alt="Previsualización de imagen"
                                    className="upload-preview mb-2"
                                    style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                />
                            ) : (
                                <span className="upload-placeholder text-center d-block border border-dashed p-4 rounded">Subir Imagen</span>
                            )}
                            <input
                                type="file"
                                className="file-input"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    <div className="form-group mb-4">
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre del producto"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-4 ">
                        <label>Unidad de Medida </label>
                        <div className="d-flex align-items-center">
                            <select
                                name="id_unidad_medida"
                                value={formData.id_unidad_medida}
                                onChange={handleInputChange}
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

                    <div className="form-group mb-4">
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            placeholder="Describe el producto..."
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            className="form-control"
                            style={{ resize: 'vertical', minHeight: '100px' }}
                        ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" onClick={closeModal} className="btn btn-secondary">
                            Cerrar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </motion.div>

            {isOpeninunidad_medida && MdAgregarUnidadMedida && (
                <MdAgregarUnidadMedida
                    showModal={isOpeninunidad_medida}
                    setShowModal={setIsOpenunidad_medida}
                    agregarUnidadMedida={agregarUnidadMedida}
                />
            )}
        </div>
    );
}
