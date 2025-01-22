import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../url';
import '../styles/productos/cardcategorias_pro.css';

const Reservas = () => {
    const { id_menu } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Número de elementos por página

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservas_fil`);
            if (!response.ok) {
                throw new Error('Error al cargar los menús con categoría');
            }
            const data = await response.json();
            setMenuItems(data.message || []);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los menús con categoría');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, [id_menu]);

    const filteredItems = menuItems.filter(item =>
        item.usuario_correo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);


    const EntregarReserva = async (id_reservas) => {
        try {
            const campos = {
                fecha_entrega: new Date().toISOString().split('T')[0], 
            };

    
            const response = await fetch(`${API_BASE_URL}/reservas/${id_reservas}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(campos),
            });
    
            if (!response.ok) {
                throw new Error(`Error al actualizar la reserva con ID ${id_reservas}`);
            }
    
            const data = await response.json();
            console.log("Reserva entregada exitosamente:", data);
            fetchMenuItems();
            return data;
        } catch (error) {
            console.error("Error al entregar la reserva:", error);
        }
    };
    


    return (
        <Container fluid className="py-5">
            <h1>Reservas</h1>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
                <p>Cargando datos...</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Cantidad de platos</th>
                                <th>precio por plato</th>
                                <th>plato</th>
                                <th>Sub total</th>
                                <th>Correo Usuario</th>
                                <th>Foto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((categoria) => (
                                    <tr key={categoria.id_menu}>
                                        <td>{categoria.id_reservas}</td>
                                        <td>{categoria.cantidad}</td>
                                        <td>{categoria.precio}</td>
                                        <td>{categoria.nombre}</td>
                                        <td>{categoria.precio * categoria.cantidad }</td>
                                        <td>{categoria.usuario_correo}</td>
                                        <td>
                                            <img
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover"
                                                }}
                                                src={`data:image/png;base64,${categoria.foto}`}
                                                alt={categoria.usuario_correo}
                                            />
                                        </td>
                                        <td>
                                            <button className="btn btn-success"
                                            onClick={() => EntregarReserva(categoria.id_reservas)} 
>
                                                Entregar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No hay reservas de este platillo todavia
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Paginación */}
            <div className="d-flex justify-content-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`btn ${index + 1 === currentPage ? 'btn-primary' : 'btn-light'} mx-1`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </Container>
    );
};

export default Reservas;
