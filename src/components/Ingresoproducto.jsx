import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { API_BASE_URL } from '../url';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function Ingresoproductos({ isOpen, setIsOpen, producto, ingresoProducto }) {
    const id = localStorage.getItem('id'); // Obtener el id de usuario del localStorage

    const [formData, setFormData] = useState({
        id_producto: producto.id_producto,
        id_usuario: id,
        tipo_movimiento: '',
        costo_unitario: '',
        cantidad: '',
        motivo: '',
    });

    const closeModal = () => setIsOpen(false);

    // Calcular el costo total dinámicamente
    const calcularTotal = () => {
        const cantidad = Number(formData.cantidad) || 0;
        const valorUnitario = parseFloat(formData.costo_unitario) || 0;
        return Math.round((cantidad * valorUnitario) *100 ) /100;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Filtrar solo números en el campo cantidad
        const valorFiltrado = name === 'cantidad'
        ? value.replace(/^0+(?=[1-9])/, '') // Eliminar ceros iniciales antes de números del 1 al 9
        : value;


        if (name === 'tipo_movimiento') {
            if (value === 'Entrada') {
                setFormData((prevData) => ({
                    ...prevData,
                    cantidad: formData.cantidad ,
                }));
            } else if (value === 'Salida') {
                setFormData((prevData) => ({
                    ...prevData,
                    cantidad: producto.stock,
                }));
                
            }
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Enviando datos...',
            text: 'Por favor, espere...',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
        });

        try {
            const response = await fetch(`${API_BASE_URL}/ingreso`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_producto: producto.id_producto,
                    id_usuario: id,
                    tipo_movimiento: formData.tipo_movimiento,
                    costo_unitario: formData.costo_unitario,
                    cantidad: formData.cantidad,
                    motivo: formData.motivo || 'Ninguna',
                    costo_total: calcularTotal(), // Calcular total en el envío
                }),
            });

            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                    title: 'Ingreso registrado con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    ingresoProducto(result.message);

                    closeModal(); // Cierra el modal después de guardar
                });

            } else {
                Swal.fire({
                    title: 'Error al ingresar el producto',
                    text: result.error || 'Hubo un problema al registrar el producto.',
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-md"
                style={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Gestión del producto llamado {producto.nombre}
                    </h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="tipo_movimiento" className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de movimiento
                        </label>
                        <select
                            id="tipo_movimiento"
                            name="tipo_movimiento"
                            value={formData.tipo_movimiento}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">Seleccione el tipo de movimiento</option>
                            <option value="Entrada">Entrada</option>
                            <option value="Salida">Salida</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="costo_unitario" className="block text-sm font-medium text-gray-700 mb-1">
                            Costo unitario
                        </label>
                        <input
                            type="number"
                            id="costo_unitario"
                            name="costo_unitario"
                            value={formData.costo_unitario}
                            min="0"
                            step="0.01"                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ej: 4"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
                            Cantidad de producto en la unidad de medida {producto.unidad_medida}
                        </label>
                        <input
                            type="number"
                            id="cantidad"
                            name="cantidad"
                            min="0"
                            step="0.01"                            value={formData.cantidad}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ej: 4"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
                            Costo total
                        </label>
                        <input
                            type="text"
                            name="total"
                            value={calcularTotal()} 
                            readOnly
                            placeholder="Total"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
                            Motivo
                        </label>
                        <textarea
                            id="motivo"
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Describe el motivo del movimiento..."
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
