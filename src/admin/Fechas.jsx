import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../url';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/tabledesign"; // Asegúrate de que esto esté importado
import { Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

function Fechas() {
    const [Fechas, setFechas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Para buscar por producto
    const [currentPage, setCurrentPage] = useState(0); // Página actual para paginación
    const [productosPorPagina, setProductosPorPagina] = useState(8); // Productos por página
    const today = new Date();
    const navigate = useNavigate(); // Para la navegación

    // Fetch para las fechas
    useEffect(() => {
        const fetchFechas = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/ingreso`);
                const data = await response.json();

                // Filtrar solo las fechas con tipo_movimiento "Entrada"
                const filteredData = data.ingreso.filter(item => item.tipo_movimiento === "Entrada");

                // Ordenar por fecha de vencimiento (más reciente primero)
                const sortedData = filteredData.sort((a, b) => new Date(b.fecha_vencimiento) - new Date(a.fecha_vencimiento));
                setFechas(sortedData || []);
            } catch (error) {
                console.error('Error al obtener las fechas:', error);
                setFechas([]);
            }
        };
        fetchFechas();
    }, []);

    // Fetch para los productos activos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/Productosactivos');
                const data = await response.json();
                if (data && data.status === 200 && Array.isArray(data.productos) && data.productos.length > 0) {
                    setProductos(data.productos);
                } else {
                    console.error("No se encontraron productos activos");
                    setProductos([]); // Evita tener un estado vacío
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
                setProductos([]); // Evita tener un estado vacío en caso de error
            }
        };
        fetchProductos();
    }, []);


    // Calcular días restantes
    const getDaysLeft = (fechaVencimiento) => {
        const vencimientoDate = new Date(fechaVencimiento);
        const diffTime = vencimientoDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Paginación
    const indexOfLastProduct = (currentPage + 1) * productosPorPagina;
    const indexOfFirstProduct = indexOfLastProduct - productosPorPagina;

    // Filtrar productos por nombre (basado en searchTerm)
    const filteredProductos = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtrar y seleccionar el ingreso más cercano por producto (solo para los productos filtrados)
    const filteredFechas = filteredProductos.map(producto => {
        // Filtrar los ingresos de este producto
        const ingresosProducto = Fechas.filter(item => item.id_producto === producto.id_producto);

        // Seleccionar el ingreso más cercano (con la fecha más próxima)
        const ingresoMasCercano = ingresosProducto.reduce((prev, curr) => {
            return new Date(prev.fecha_vencimiento) < new Date(curr.fecha_vencimiento) ? prev : curr;
        }, ingresosProducto[0]);

        return ingresoMasCercano;
    }).filter(item => item); // Filtrar productos sin ingresos

    // Ordenar las fechas para que los productos por vencer estén primero
    const sortedFechas = filteredFechas.sort((a, b) => {
        const daysLeftA = getDaysLeft(a.fecha_vencimiento);
        const daysLeftB = getDaysLeft(b.fecha_vencimiento);

        // Priorizar los productos que están por vencerse
        if (daysLeftA <= 3 && daysLeftB > 3) return -1; // A se muestra antes que B si A está por vencerse
        if (daysLeftB <= 3 && daysLeftA > 3) return 1; // B se muestra antes que A si B está por vencerse
        return new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento); // Ordenar por fecha de vencimiento
    });

    const currentFechas = sortedFechas.slice(indexOfFirstProduct, indexOfLastProduct);
    const pageCount = Math.ceil(sortedFechas.length / productosPorPagina);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl titulo font-bold tracking-tight">Productos por vencerse</h1>
            </div>
            <p className="titulo font-bold tracking-tight">Cuidado con tus productos que estan proximos a vencer</p>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar producto por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="border rounded-lg bg-card">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Fecha de Vencimiento</TableHead>
                                <TableHead>Días Restantes</TableHead>
                                <TableHead>Estado</TableHead> {/* Campo adicional */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentFechas.length > 0 ? (
                                currentFechas.map((item) => {
                                    const producto = productos.find(p => p.id_producto === item.id_producto);
                                    const daysLeft = getDaysLeft(item.fecha_vencimiento);
                                    const isExpiringSoon = daysLeft <= 3 && daysLeft >= 0; // Producto con fecha de vencimiento en 3 días o menos

                                    // Aquí agregamos la condición para marcar como "Vencido" si los días restantes son negativos
                                    const estado = daysLeft <= 0 ? 'Vencido' : (isExpiringSoon ? 'Por Vencerse' : 'Vigente');

                                    return (
                                        <TableRow
                                            key={item.id_ingreso}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell>{producto ? producto.nombre : 'Producto no encontrado'}</TableCell>
                                            <TableCell>{new Date(item.fecha_vencimiento).toLocaleDateString()}</TableCell>
                                            <TableCell>{daysLeft} días</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estado === 'Vencido' ? "bg-gray-100 text-gray-800" : isExpiringSoon ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                                                    {estado}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No hay productos disponibles para mostrar.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                    previousLabel={'Anterior'}
                    nextLabel={'Siguiente'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={4}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                />
            </div>
        </div>
    );
}

export default Fechas;
