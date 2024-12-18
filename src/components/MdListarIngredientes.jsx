'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Plus } from 'lucide-react';
import { API_BASE_URL } from '../url';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/tabledesign";
import { useParams } from 'react-router-dom'; // Importar useParams
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/input';
import axios from 'axios'; // Importar axios

export default function ListarIngredientes() {
    const { idReceta } = useParams(); // Recuperar el idReceta desde los parámetros de la URL
    const [productos, setProductos] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [productosPorPagina] = useState(10);
    const [selectedProductos, setSelectedProductos] = useState([]); // Para almacenar los productos seleccionados
    const [cantidades, setCantidades] = useState({}); // Objeto que guarda la cantidad de cada producto seleccionado
    const [dialogOpen, setDialogOpen] = useState(false); // Estado para abrir y cerrar el cuadro de diálogo

    // Cargar datos desde el servidor con axios
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/productos`);
                const data = response.data;

                if (data && Array.isArray(data.productos)) {
                    setProductos(data.productos);
                } else {
                    setProductos([]);
                }
            } catch (error) {
                console.error('Error al obtener los productos:', error);
                alert('No se pudo cargar la información.');
                setProductos([]);
            }
        };

        fetchProductos();
    }, []);

    // Paginación de los productos
    const paginacion = productos.slice((pagina - 1) * productosPorPagina, pagina * productosPorPagina);

    const manejarCambioPagina = (numeroPagina) => {
        if (numeroPagina >= 1 && numeroPagina <= Math.ceil(productos.length / productosPorPagina)) {
            setPagina(numeroPagina);
        }
    };

    // Función para manejar el cambio en la cantidad de cada ingrediente
    const manejarCambioCantidad = (idProducto, e) => {
        setCantidades(prev => ({
            ...prev,
            [idProducto]: e.target.value
        }));
    };

    // Función para manejar el checkbox y seleccionar productos
    const manejarCambioSeleccion = (idProducto) => {
        setSelectedProductos(prevSelected => {
            if (prevSelected.includes(idProducto)) {
                return prevSelected.filter(id => id !== idProducto);
            } else {
                return [...prevSelected, idProducto];
            }
        });
    };

    // Función para enviar los productos seleccionados con axios
    const manejarAgregarIngredientes = async () => {
        if (!idReceta) {
            alert("No se ha encontrado el id de la receta.");
            return;
        }

        const productosAAgregar = selectedProductos.map(idProducto => ({
            id_producto: idProducto,
            id_receta: idReceta, // Este es el id de la receta obtenido de la URL
            cantidad: parseInt(cantidades[idProducto]) || 0 // Si no hay cantidad, se usa 0 por defecto
        })).filter(producto => producto.cantidad > 0); // Solo enviar productos con cantidad válida

        if (productosAAgregar.length === 0) {
            alert("Debe ingresar una cantidad válida para al menos un producto.");
            return;
        }

        // Confirmamos los datos antes de enviarlos
        console.log("Enviando productos a la API:", productosAAgregar);

        try {
            for (const producto of productosAAgregar) {
                const response = await axios.post(`${API_BASE_URL}/receta_producto`, producto, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 201) {
                    window.location.reload();
                    alert("Ingrediente agregado a la receta.");
                } else {
                    alert("Error al agregar el ingrediente.");
                }
            }
        } catch (error) {
            console.error('Error al realizar la inserción:', error);
            alert('Error al agregar el ingrediente.');
        }

        setDialogOpen(false); // Cerrar el cuadro de diálogo después de enviar los datos
        setSelectedProductos([]); // Limpiar selección de productos
        setCantidades({}); // Limpiar cantidades
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-[80%] max-w-[1000px] h-auto max-h-[80vh] p-6 rounded-lg shadow-lg overflow-hidden overflow-y-auto">

                {/* Card Header: Título */}
                <div className="border-b p-6">
                    <h1 className="text-3xl font-bold tracking-tight justify-center">Lista de Ingredientes</h1>
                </div>

                {/* Card Body: Tabla con los Productos */}
                <div className="p-6 overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <form action="">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Seleccionar</TableHead>
                                    <TableHead>Imagen</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead className="max-w-[300px]">Descripción</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginacion.length > 0 ? (
                                    paginacion.map((producto) => (
                                        <TableRow key={producto.id_producto} className="hover:bg-muted/50 transition-colors">
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProductos.includes(producto.id_producto)}
                                                    onChange={() => manejarCambioSeleccion(producto.id_producto)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                                                    <img
                                                        src={`data:image/png;base64,${producto.foto}`}
                                                        alt={producto.nombre}
                                                        className="h-full w-full object-cover transition-transform hover:scale-110"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>{producto.nombre}</TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <p className="truncate" title={producto.descripcion}>
                                                    {producto.descripcion.length > 50 ? producto.descripcion.substring(0, 50) + '...' : producto.descripcion}
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No hay ingredientes disponibles.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </form>
                </div>

                {/* Card Footer: Botón Agregar Ingrediente */}
                <div className="border-t p-6 flex justify-between">
                    <Button
                        variant="outline"
                        className="mx-2"
                        onClick={() => setDialogOpen(true)} // Abrir cuadro de diálogo
                    >
                        Agregar Ingrediente
                    </Button>
                </div>

                {/* Cuadro de Diálogo: Cantidad del ingrediente */}
                {dialogOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <DialogTitle>Agregar Ingredientes</DialogTitle>
                            <DialogDescription>Ingrese la cantidad de los ingredientes seleccionados:</DialogDescription>

                            {/* Crear campos de cantidad para cada producto seleccionado */}
                            {selectedProductos.map(idProducto => {
                                const producto = productos.find(p => p.id_producto === idProducto);
                                return (
                                    <div key={idProducto} className="mb-4">
                                        <label className="block text-sm font-medium">{producto.nombre}</label>
                                        <Input
                                            type="number"
                                            value={cantidades[idProducto] || ''}
                                            onChange={(e) => manejarCambioCantidad(idProducto, e)}
                                            className="mt-2"
                                            placeholder="Cantidad"
                                        />
                                    </div>
                                );
                            })}

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={manejarAgregarIngredientes}
                                    disabled={selectedProductos.length === 0}
                                >
                                    Agregar a la Receta
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)} // Cerrar cuadro de diálogo
                                >
                                    Cancelar
                                </Button>
                            </DialogFooter>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
