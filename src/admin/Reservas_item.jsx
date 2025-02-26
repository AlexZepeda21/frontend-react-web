import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { ADMIN, API_BASE_URL } from '../url';
import '../styles/productos/cardcategorias_pro.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2'; // Importar SweetAlert2



const Reservas_item = () => {
    const { id_menu } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; 
    const navigate = useNavigate(); 



    const location = useLocation();
  const { id_re  } = location.state || {};

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reservas_item/${id_re}`);
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


    const EntregarReserva = async () => {
        try {
            const campos = {
                fecha_entrega: new Date().toISOString().split('T')[0], 
            };

    
            const response = await fetch(`${API_BASE_URL}/reservas/${id_re}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(campos),
            });
    
            if (!response.ok) {
                throw new Error(`Error al actualizar la reserva con ID ${id_re}`);
            }
    
            const data = await response.json();
            Swal.fire({
                      icon: 'success',
                      title: 'Reserva Entrega',
                      toast: true,  // Notificación tipo toast
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 3000,  // Duración de la notificación en milisegundos
                    });

                    navigate(`${ADMIN}/Reservas`,); 

            fetchMenuItems();
            return data;
        } catch (error) {
            console.error("Error al entregar la reserva:", error);
        }
    };


    


    return (
        <Container fluid className="py-5">
            <h1>Reservas item</h1>
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
                                <th>Nombre del articulo</th>
                                <th>Precio unitario</th>
                                <th>Sub total</th>
                                <th>Foto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((categoria) => (
                                    <tr>
                                        <td>{categoria.id_reservas}</td>
                                        <td>{categoria.cantidad}</td>
                                        <td>{categoria.nombre}</td>
                                        <td>{categoria.precio}</td>
                                        <td>$ {categoria.precio * categoria.cantidad}</td>
                                        <td>
                                            <img
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover"
                                                }}
                                                src={`data:image/png;base64,${categoria.foto}`}
                                            />
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

                            {currentItems.length > 0 ? (
                                <tr >
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>

                                <td>
                                
                                    Total $ {currentItems.reduce((acc, categoria) => acc + categoria.precio * categoria.cantidad, 0)}

                                </td>
                                <td  >
                                <button className="btn btn-success"
                                      onClick={() => EntregarReserva()} 

                                    >
                                        Entregar
                                    </button>
                                </td>
                            </tr>
                            ) : (
                                <></>
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

export default Reservas_item;
