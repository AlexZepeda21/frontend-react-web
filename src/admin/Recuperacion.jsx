import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../url';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/tabledesign";

const Recuperacion = () => {
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
            const response = await fetch(`${API_BASE_URL}/mensajes`);
            if (!response.ok) {
                throw new Error('Error al cargar los menús con categoría');
            }
            const data = await response.json();
            setMenuItems(data.ingreso || []);
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
        item.correo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const cambiocontraseña = async (id_usuario,id_mensajes) => {

        const responseusuario = await fetch(`${API_BASE_URL}/user/${id_usuario}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clave: "ITCA-FEPADE" }),
    });

    const result = await responseusuario.json();
    if (responseusuario.ok && result.status === 200) {
        Swal.fire({
            title: 'Su contraseña ha sido cambiada',
            text: 'Su nueva contraseña es: ITCA-FEPADE.',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'OK'
          });
          const responsemensaje = await fetch(`${API_BASE_URL}/mensajes/${id_mensajes}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: 0 }),
    });
    }
    
        
    }

    return (
        <Container fluid className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl titulo font-bold tracking-tight">Recuperacion</h1>
            <p className="titulo font-bold tracking-tight">Gestione la recuperacion de las contraseñas de los estudiantes</p>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar correo de usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
                <p>Cargando datos...</p>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Mensaje</TableHead>
                                <TableHead>Correo Usuario</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.length > 0 ? (
                                currentItems.map((categoria) => (
                                    <TableRow key={categoria.id_mensajes}>
                                        <TableCell>{categoria.id_mensajes}</TableCell>
                                        <TableCell>{categoria.Mensaje}</TableCell>
                                        <TableCell>{categoria.correo}</TableCell>
                                        <TableCell>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => cambiocontraseña(categoria.id_usuario,categoria.id_mensajes)}
                                            >
                                                Restablecer contraseñas
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="6" className="text-center">
                                        No hay mensajes todavia
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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

export default Recuperacion;
