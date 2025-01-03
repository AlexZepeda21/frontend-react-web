import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/tabledesign";
import { API_BASE_URL } from '../url';
import MdAgregarUnidadMedida from '../components/MdAgregarUnidadMedida'; // Modal for adding unit
import MdEditarUnidadMedida from '../components/MdEditarUnidadMedida'; // Modal for editing unit
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import '../styles/Perfil/unidades.css';

const UnidadMedidaList = () => {
  const [unidades, setUnidades] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null); // Unit selected for editing
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const [unidadesPorPagina, setUnidadesPorPagina] = useState(2); // Units per page
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    axios.get(`${API_BASE_URL}/uni_medidas`)
      .then((response) => {
        if (response.data.status === 200) {
          if (response.data.unidad_medida && response.data.unidad_medida.length > 0) {
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


  
  // Pagination
  const indexOfLastUnidad = (currentPage + 1) * unidadesPorPagina;
  const indexOfFirstUnidad = indexOfLastUnidad - unidadesPorPagina;

  // Filter units by name
  const filteredUnidades = unidades.filter(unidad =>
    unidad.nombre_unidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUnidades = filteredUnidades.slice(indexOfFirstUnidad, indexOfLastUnidad);
  const pageCount = Math.ceil(filteredUnidades.length / unidadesPorPagina);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Open edit modal
  const openModalEditar = (unidad) => {
    setUnidadSeleccionada(unidad);
    setShowModalEditar(true);
  };

  // Deactivate unit
  const handleDesactivar = (id) => {
    axios.put(`${API_BASE_URL}/uni_medidas/${id}`, { estado: 0 })
      .then(() => {
        const updatedUnidades = unidades.map(unidad =>
          unidad.id_unidad_medida === id ? { ...unidad, estado: 0 } : unidad
        );
        setUnidades(updatedUnidades);
      })
      .catch(() => {
        setError('Error al desactivar la unidad.');
      });
  };

  
  const agregarUnidadMedida = (nuevaUnidad) => {
    setUnidades((prev) => [...prev, nuevaUnidad]);

  };

  const actualizarUnidad = (Unidad) =>{
    setUnidades((prev) => 
      prev.map((unidad_medida) =>
        unidad_medida.id_unidad_medida === Unidad.id_unidad_medida ? Unidad : unidad_medida
      )
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl titulo font-bold tracking-tight">Unidades de Medida</h1>
        <Button onClick={() => setShowModal(true)} size="lg" className='m-1 btn-agregar'>
          Agregar Unidad
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar unidad de medida"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="recordsPerPage" className="mr-2">Registros por página:</label>
        <select
          id="recordsPerPage"
          value={unidadesPorPagina}
          onChange={(e) => setUnidadesPorPagina(Number(e.target.value))}
          className="form-control small-select"
        >
          <option value={2}>2</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>


      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showModal && (
        <MdAgregarUnidadMedida showModal={showModal} setShowModal={setShowModal}
        agregarUnidadMedida={agregarUnidadMedida}
        />
      )}

      {showModalEditar && unidadSeleccionada && (
        <MdEditarUnidadMedida
          showModalEditar={showModalEditar}
          setShowModalEditar={setShowModalEditar}
          unidad={unidadSeleccionada}
          actualizarUnidad={actualizarUnidad}
        />
      )}

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUnidades.length > 0 ? (
              currentUnidades.map((unidad, index) => (
                <TableRow key={unidad.id_unidad_medida} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{unidad.nombre_unidad}</TableCell>
                  <TableCell>
                    {(() => {
                      let claseEstado = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ";
                      let textoEstado = "";

                      if (Number(unidad.estado) === 1) {
                        claseEstado += "bg-green-100 text-green-800";
                        textoEstado = "Activo";
                      } else {
                        claseEstado += "bg-red-100 text-gray-800";
                        textoEstado = "Inactivo";
                      }

                      return (
                        <span className={claseEstado}>
                          {textoEstado}
                        </span>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <button
                      className="btn btn-edit d-flex align-items-center m-1"
                      onClick={() => openModalEditar(unidad)}
                    >
                      <FaEdit className="me-1 btn-edit" /> Editar
                    </button>
                    {Number(unidad.estado) === 1 && (
                      <button
                        className="btn btn-danger d-flex align-items-center m-1"
                        onClick={() => handleDesactivar(unidad.id_unidad_medida)}
                      >
                        <FaTrashAlt className="me-1" /> Desactivar
                      </button>
                    )}

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No hay unidades de medida disponibles.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
};

export default UnidadMedidaList;
