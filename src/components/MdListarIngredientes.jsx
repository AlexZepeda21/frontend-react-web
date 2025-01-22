'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { API_BASE_URL } from '../url';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/tabledesign";
import { useParams } from 'react-router-dom';
import { DialogTitle, DialogDescription, DialogFooter } from '../components/ui/Dialog';
import { Input } from '../components/ui/input';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ListarIngredientes() {
    const { idReceta } = useParams();
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [productosPorPagina] = useState(10);
    const [selectedProductos, setSelectedProductos] = useState([]);
    const [cantidades, setCantidades] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/Productosactivos`);
                const data = response.data;

                if (data && Array.isArray(data.productos)) {
                    setProductos(data.productos);
                    setProductosFiltrados(data.productos); // Inicializar los productos filtrados con todos los productos
                } else {
                    setProductos([]);
                    setProductosFiltrados([]);
                }
            } catch (error) {
                console.error('Error al obtener los productos:', error);
                alert('No se pudo cargar la información.');
                setProductos([]);
                setProductosFiltrados([]);
            }
        };

        fetchProductos();
    }, []);

    useEffect(() => {
        // Filtrar los productos según el término de búsqueda
        if (busqueda.trim() === '') {
            setProductosFiltrados(productos);
        } else {
            const productosFiltradosPorNombre = productos.filter(producto =>
                producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
            setProductosFiltrados(productosFiltradosPorNombre);
        }
    }, [busqueda, productos]);

    // Lógica para paginación
    const totalProductos = productosFiltrados.length;
    const paginacion = productosFiltrados.slice((pagina - 1) * productosPorPagina, pagina * productosPorPagina);


    const cerrarModal = async () => {
        window.location.reload();
    }

    const cambiarPagina = (nuevaPagina) => {
        setPagina(nuevaPagina);
    };

    // Manejo de los cambios de cantidad y selección de productos (como ya lo tienes)
    const manejarCambioCantidad = (idProducto, e) => {
        const valor = e.target.value.trim();
        if (!isNaN(valor) && valor !== '') {
            setCantidades(prev => ({
                ...prev,
                [idProducto]: parseFloat(valor)
            }));
        }
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
            if (isNaN(cantidad) || cantidad <= 0) {
                Swal.fire({
                    icon: 'question',
                    title: 'Cantidad invalida para el producto ' + idProducto,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                return null;
            }

            return {
                id_producto: idProducto,
                id_receta: idReceta,
                cantidad: cantidad
            };
        }).filter(producto => producto !== null);

        if (productosAAgregar.length === 0) {
            Swal.fire({
                icon: 'question',
                title: 'Debes agregar una cantidad valida para el producto',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
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
                        text: 'Ingrediente agregado con exito',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                    });

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Posiblemente el ingrediente ya exista, actualiza la pagina o verifica si hay producto en el inventario.',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
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
                timer: 3000,
            });
        }

        setDialogOpen(false);
        setSelectedProductos([]);
        setCantidades({});
    };

    return (
        <div className="bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-[100%] max-w-[1000px] h-auto max-h-[80vh] p-6 rounded-lg shadow-lg overflow-hidden overflow-y-auto">

                {/* Campo de Búsqueda */}
                <div className="p-6">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre de producto..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full"
                    />
                </div>

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


                    {/* Paginación */}
                    <div className="flex justify-between items-center p-4">
                        <Button
                            variant="outline"
                            disabled={pagina === 1}
                            onClick={() => cambiarPagina(pagina - 1)}
                        >
                            Anterior
                        </Button>
                        <span>Página {pagina} de {Math.ceil(totalProductos / productosPorPagina)}</span>
                        <Button
                            variant="outline"
                            disabled={pagina === Math.ceil(totalProductos / productosPorPagina)}
                            onClick={() => cambiarPagina(pagina + 1)}
                        >
                            Siguiente
                        </Button>

                        <Button
                            variant="outline"
                            className="mx-2"
                            onClick={() => setDialogOpen(true)}
                        >
                            Agregar Ingrediente
                        </Button>

                    </div>
                </div>
                {/* Cuadro de Diálogo: Cantidad del ingrediente */}
                {dialogOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <DialogTitle>Agregar Ingredientes</DialogTitle>
                            <DialogDescription>Ingrese la cantidad de los ingredientes seleccionados:</DialogDescription>

                            {/* Contenedor con overflow-y-auto para permitir el desplazamiento vertical */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {selectedProductos.map(idProducto => {
                                    const producto = productos.find(p => p.id_producto === idProducto);
                                    return (
                                        <div key={idProducto} className="mb-4">
                                            <label className="block text-sm font-medium">{producto.nombre}</label>
                                            <Input
                                                type="number"
                                                step="any"
                                                value={cantidades[idProducto] || ''}
                                                onChange={(e) => manejarCambioCantidad(idProducto, e)}
                                                className="mt-2"
                                                placeholder={"Cantidad en " + producto.unidad_medida}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

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
                                    onClick={() => setDialogOpen(false)}
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
