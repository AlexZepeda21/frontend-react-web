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
    const [unidades, setUnidades] = useState([]);
    const [error, setError] = useState('');
    const { idReceta } = useParams();
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [productosPorPagina] = useState(10);

    const [selectedProductos, setSelectedProductos] = useState([]);
    const [unidadesSeleccionadas, setUnidadesSeleccionadas] = useState({});
    const [DataConversion, setDataConversion] = useState({});

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

    useEffect(() => {
        axios.get(`${API_BASE_URL}/uni_medidas`)
            .then((response) => {
                if (response.data.status === 200) {
                    if (response.data.unidad_medida && Array.isArray(response.data.unidad_medida)) {
                        setUnidades(response.data.unidad_medida);
                    } else {
                        setError('No hay unidades de medida registradas.');
                    }
                } else {
                    setError('Hubo un problema al obtener las unidades.');
                }
            })
            .catch((error) => {
                setError('Hubo un problema al cargar las unidades.');
            });
    }, []);

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


    async function RecuperarUnidades() {
        const conversiones = await Promise.all(selectedProductos.map(async (idProducto) => {
            const producto = productos.find(p => p.id_producto === idProducto);
            const cantidadProducto = cantidades[idProducto] || 0;
            const unidadSeleccionada = unidadesSeleccionadas[idProducto] || 0;
    
            const unidadBase = producto ? producto.unidad_medida : null;
            const unidadBaseId = unidades.find(unidad => unidad.nombre_unidad === unidadBase)?.id_unidad_medida;
    
            if (producto && unidadBaseId) {
                return {
                    id_producto: idProducto,
                    nombre_producto: producto.nombre,
                    unidad_base_id: unidadBaseId,
                    cantidad: cantidadProducto,
                    unidad_seleccionada: unidadSeleccionada
                };
            } else {
                return null;
            }
        }));
    
        const conversionesValidas = conversiones.filter(item => item !== null);
    
        // Actualizamos el estado con los productos y unidades a convertir
        setDataConversion(conversionesValidas);
    
        // Devolvemos las conversiones válidas para que puedan ser usadas inmediatamente
        return conversionesValidas;
    }
    
    async function CalcularConversion(conversiones) {
        try {
            const response = await axios.get(`${API_BASE_URL}/conversiones`);
    
            if (response.status === 200 && response.data.status === 'success') {
                const conversionesAPI = response.data.data;
    
                // Aplicamos la conversión a todos los productos seleccionados
                const productosConvertidos = await Promise.all(conversiones.map(async (producto) => {
                    const unidadSeleccionada = producto.unidad_seleccionada;
                    const unidadBaseId = producto.unidad_base_id;
                    const cantidad = producto.cantidad;
    
                    // Buscamos la conversión entre las unidades
                    const conversion = conversionesAPI.find(conv => {
                        return (conv.id_unidad_origen === unidadBaseId && conv.id_unidad_destino === unidadSeleccionada) ||
                            (conv.id_unidad_origen === unidadSeleccionada && conv.id_unidad_destino === unidadBaseId);
                    });
    
                    if (conversion) {
                        const factor = conversion.factor;
                        const cantidadConvertida = cantidad * factor;
                        return {
                            ...producto,
                            cantidad_convertida: cantidadConvertida,
                            factor_conversion: factor,
                        };
                    } else {
                        // Si no hay conversión, devolvemos el producto tal cual
                        return producto;
                    }
                }));
    
                // Actualizamos el estado de productos convertidos
                setDataConversion(productosConvertidos);
    
                // Devolvemos los productos convertidos para que puedan ser usados inmediatamente
                return productosConvertidos;
            } else {
                console.error("Error al obtener las conversiones:", response);
                alert("Hubo un error al obtener las conversiones.");
                return [];
            }
        } catch (error) {
            console.error("Error en la solicitud a la API de conversiones:", error);
            alert("Hubo un error al realizar la solicitud a la API de conversiones.");
            return [];
        }
    }
    
    async function manejarAgregarIngredientes() {
        if (!idReceta) {
            alert("No se ha encontrado el id de la receta.");
            return;
        }
    
        // Primero, recuperamos las unidades y realizamos las conversiones necesarias
        const conversionesValidas = await RecuperarUnidades();  // Esperamos a que las conversiones estén listas
    
        // Luego, calculamos las conversiones
        const productosConvertidos = await CalcularConversion(conversionesValidas);
    
        // Esperar a que las conversiones estén completamente actualizadas antes de proceder
        if (!Array.isArray(productosConvertidos) || productosConvertidos.length === 0) {
            alert("Las conversiones no están listas.");
            return;
        }
    
        // Ahora construimos el arreglo de productos a agregar con las conversiones aplicadas
        const productosAAgregar = selectedProductos.map(idProducto => {
            const cantidad = cantidades[idProducto];  // La cantidad original
            const unidadMedida = unidadesSeleccionadas[idProducto];
    
            // Buscar el producto convertido en el arreglo productosConvertidos
            let cantidadConvertida = cantidad;  // Inicializamos con la cantidad original
    
            // Verificamos si productosConvertidos está disponible
            const productoConvertido = productosConvertidos.find(item => item.id_producto === idProducto);
            if (productoConvertido && productoConvertido.cantidad_convertida) {
                cantidadConvertida = productoConvertido.cantidad_convertida;
            }
    
            // Validar que la cantidad sea un número positivo y que haya una unidad de medida
            if (isNaN(cantidadConvertida) || cantidadConvertida <= 0 || !unidadMedida) {
                Swal.fire({
                    icon: 'question',
                    title: `Cantidad o unidad inválida para el producto ${idProducto}`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                });
                return null;
            }
    
            // Aquí estamos asegurándonos de que la cantidad_convertida esté correctamente asignada
            return {
                id_producto: idProducto,
                id_receta: idReceta,
                cantidad: cantidadConvertida,  // Usar la cantidad convertida o la original
                id_unidad_medida: unidadMedida,
            };
        }).filter(producto => producto !== null);
    
        if (productosAAgregar.length === 0) {
            Swal.fire({
                icon: 'question',
                title: 'Debes agregar una cantidad válida para el producto',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }
    
        console.log("Enviando productos a la API:", productosAAgregar);
    
        // Enviamos los productos convertidos a la API después de haber calculado las conversiones
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
                        text: 'Ingrediente agregado con éxito',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Posiblemente el ingrediente ya exista, actualiza la página o verifica si hay producto en el inventario.',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Posiblemente el ingrediente ya exista, actualiza la página o verifica si hay producto en el inventario.',
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
    }
    
    //AQUI II I I I
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
                                            <TableCell>{producto.nombre}</TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <p className="truncate">
                                                    Guardado en {producto.unidad_medida}
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
                                                placeholder={"Agregue la cantidad de producto que necesita"}
                                            />

                                            <div>
                                                <br />
                                                <label htmlFor="">Unidad de medida a usar</label>
                                                <select
                                                    id="select"
                                                    className="form-control"
                                                    value={unidadesSeleccionadas[idProducto] || ''}
                                                    onChange={(e) => {
                                                        const unidadSeleccionada = parseInt(e.target.value, 10); // Convertimos a entero
                                                        setUnidadesSeleccionadas(prev => ({
                                                            ...prev,
                                                            [idProducto]: unidadSeleccionada // Guardamos el id como entero
                                                        }));
                                                    }}
                                                >
                                                    <option value="">--Selecciona una opción--</option>
                                                    {unidades.map((unidad) => (
                                                        <option key={unidad.id_unidad_medida} value={unidad.id_unidad_medida}>
                                                            {unidad.nombre_unidad}
                                                        </option>
                                                    ))}
                                                </select>


                                            </div>

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

                                <Button
                                    variant="outline"
                                    onClick={RecuperarUnidades}
                                >
                                    Ver detalles
                                </Button>

                            </DialogFooter>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
