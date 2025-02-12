import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../url';
import '../styles/productos/cardcategorias_pro.css';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2'; // Importar SweetAlert2


const Reservas = () => {
    const { id_menu } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; 
    const navigate = useNavigate(); 


    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/web_reservas`);
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
        const id_re = id_reservas;
        navigate(`/admin/Items`, { state: {id_re}  }); 

    }

    


    return (
        <Container fluid className="p-8 max-w-7xl mx-auto">
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
                                <th>Cantidad de articulos</th>
                                <th>Sub total</th>
                                <th>Correo Usuario</th>
                                <th>Foto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((categoria) => (
                                    <tr key={categoria.id_reservas}>
                                        <td>{categoria.id_reservas}</td>
                                        <td>{categoria.cantidad}</td>
                                        <td>{categoria.precio}</td>
                                        <td>{categoria.usuario_correo}</td>
                                        <td>
                                            <img
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover"
                                                }}
                                                src={`data:image/png;base64,${categoria.img}`}
                                                alt={categoria.usuario_correo}
                                            />
                                        </td>
                                        <td>
                                        <button className="btn btn-success"
                                            onClick={() => EntregarReserva(categoria.id_reservas)} 
>
                                                Ver Articulos
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
