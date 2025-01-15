
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { API_BASE_URL } from '../url';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/tabledesign";
import { useParams } from 'react-router-dom'; // Importar useParams
import { DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/input';
import axios from 'axios'; // Importar axios
import Swal from 'sweetalert2'  // Import SweetAlert2

export default function ListarIngredientes() {
    const { idReceta } = useParams(); // Recuperar el idReceta desde los parámetros de la URL
    const [productos, setProductos] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [productosPorPagina] = useState(10);
    const [selectedProductos, setSelectedProductos] = useState([]); // Para almacenar los productos seleccionados
    const [cantidades, setCantidades] = useState({}); // Objeto que guarda la cantidad de cada producto seleccionado
    const [dialogOpen, setDialogOpen] = useState(false); // Estado para abrir y cerrar el cuadro de diálogo

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/Productosactivos`);
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

    const paginacion = productos.slice((pagina - 1) * productosPorPagina, pagina * productosPorPagina);


    const manejarCambioCantidad = (idProducto, e) => {
        // Asegurarse de que el valor ingresado sea un número válido (decimal o entero)
        const valor = e.target.value.trim();

        // Verificar si el valor es un número válido
        if (!isNaN(valor) && valor !== '') {
            setCantidades(prev => ({
                ...prev,
                [idProducto]: parseFloat(valor) // Almacenamos como número (decimal o entero)
            }));
        }
    };



    const Cerrar = () => {
        window.location.reload();
    };

    const manejarCambioSeleccion = (idProducto) => {
        setSelectedProductos(prevSelected => {
            if (prevSelected.includes(idProducto)) {
                return prevSelected.filter(id => id !== idProducto);
            } else {
                return [...prevSelected, idProducto];
            }
        });
    };

    const manejarAgregarIngredientes = async () => {
        if (!idReceta) {
            alert("No se ha encontrado el id de la receta.");
            return;
        }

        const productosAAgregar = selectedProductos.map(idProducto => {
            const cantidad = cantidades[idProducto];

            // Asegurarse de que la cantidad es un número y mayor que cero
            if (isNaN(cantidad) || cantidad <= 0) {
                Swal.fire({
                    icon: 'question',
                    title: 'Cantidad invalida para el producto ' + idProducto,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,  // Duración de la notificación (en milisegundos)
                });
                return null;  // No agregamos productos con cantidades inválidas
            }

            return {
                id_producto: idProducto,
                id_receta: idReceta,
                cantidad: cantidad  // Mantener el valor tal cual es (decimal o entero)
            };
        }).filter(producto => producto !== null);  // Filtrar productos con cantidades inválidas

        if (productosAAgregar.length === 0) {
            Swal.fire({
                icon: 'question',
                title: 'Debes agregar una cantidad valida para el producto',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,  // Duración de la notificación (en milisegundos)
            });
            return;
        }

        console.log("Enviando productos a la API:", productosAAgregar);

        try {
            for (const producto of productosAAgregar) {
                const response = await axios.post(`${API_BASE_URL}/receta_producto`, producto, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 201) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Ingrediente agregado a la receta',
                        text: 'Espere a que se reinicie el navegador',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,  // Duración de la notificación (en milisegundos)
                    });

                    // Después de 1 segundo, recargar la página
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000); // 1000 milisegundos = 1 segundo

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Posiblemente el ingrediente ya exista, actualiza la pagina o verifica si hay producto en el inventario.',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,  // Duración de la notificación (en milisegundos)
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'Error',
                title: 'Posiblemente el ingrediente ya exista, actualiza la pagina o verifica si hay producto en el inventario.',
                text: error.message,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,  // Duración de la notificación (en milisegundos)
            });
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
                <div>

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
                                    <TableHead className="max-w-[300px]">Unidad medida</TableHead>
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
                                                <p className="truncate">
                                                    {producto.unidad_medida}
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
                    <Button
                        variant="outline"
                        className="mx-2"
                        onClick={Cerrar} // Abrir cuadro de diálogo
                    >
                        Cerrar
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
                                            step="any"  // Permite cualquier valor decimal
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
