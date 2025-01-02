import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/tabledesign";
import { API_BASE_URL } from '../url';
import MdAgregarRecetas from '../components/MdAgregarreceta';
import MdEditarReceta from '../components/MdEditarReceta'; // Modal de Editar receta
import { useParams } from 'react-router-dom';

const RecetasList = () => {
  const { categoriaId } = useParams(); // Obtener el id de la categoría desde la URL
  const [recetas, setRecetas] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false); // Estado para el modal de Editar receta
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null); // Receta seleccionada
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el buscador
  const [currentPage, setCurrentPage] = useState(0); // Estado para la página actual
  const [recetasPorPagina, setRecetasPorPagina] = useState(8); // Cantidad de recetas por página
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  useEffect(() => {
    axios.get(`${API_BASE_URL}/recetas?categoria_id=${categoriaId}`)
      .then((response) => {
        if (response.data && response.data.recetas) {
          // Ordenar las recetas por ID de manera descendente
          const recetasOrdenadas = response.data.recetas;
          recetasOrdenadas.sort((a, b) => b.id_recetas - a.id_recetas);
          setRecetas(recetasOrdenadas);
        } else {
          setError('No se encontraron recetas para esta categoría.');
        }
      })
      .catch((error) => {
        setError('Hubo un problema al cargar las recetas.');
      });
  }, [categoriaId]);

  // Paginación
  const indexOfLastRecipe = (currentPage + 1) * recetasPorPagina;
  const indexOfFirstRecipe = indexOfLastRecipe - recetasPorPagina;

  // Filtrar recetas por el nombre
  const filteredRecetas = recetas.filter(receta =>
    receta.nombre_receta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRecetas = filteredRecetas.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const pageCount = Math.ceil(filteredRecetas.length / recetasPorPagina);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleVerReceta = (idReceta) => {
    navigate(`/admin/verReceta/${idReceta}`);  // Corrección: usa la ruta absoluta para redirigir correctamente
  };

  // Función para abrir el modal "Editar"
  const openModalEditar = (receta) => {
    setRecetaSeleccionada(receta);
    setShowModalEditar(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Lista de Recetas</h1>
        <Button onClick={() => setShowModal(true)} size="lg" className='m-1'>
          Agregar Receta
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar receta por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showModal && (
        <MdAgregarRecetas showModal={showModal} setShowModal={setShowModal} />
      )}

      {showModalEditar && recetaSeleccionada && (
        <MdEditarReceta
          showModalEditar={showModalEditar}
          setShowModalEditar={setShowModalEditar}
          receta={recetaSeleccionada}
        />
      )}

      <div className="border rounded-lg bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">#</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="max-w-[300px]">Descripción</TableHead>
                <TableHead>Tiempo preparación</TableHead>
                <TableHead>Porciones</TableHead>
                <TableHead>Dificultad</TableHead>
                <TableHead>Foto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Opciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecetas.length > 0 ? (
                currentRecetas.map((receta, index) => (
                  <TableRow key={receta.id_recetas} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{receta.nombre_receta}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="truncate" title={receta.descripcion}>
                        {receta.descripcion}
                      </p>
                    </TableCell>
                    <TableCell>{receta.tiempo_preparacion} min</TableCell>
                    <TableCell>{receta.numero_porciones}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        receta.dificultad === "Fácil" ? "bg-green-100 text-green-800" :
                        receta.dificultad === "Medio" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {receta.dificultad}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                        <img
                          src={`data:image/png;base64,${receta.foto}`}
                          alt={receta.foto}
                          className="h-full w-full object-cover transition-transform hover:scale-110"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        receta.estado ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {receta.estado ? "Activo" : "Inactivo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button className="form-control primary m-1" onClick={() => openModalEditar(receta)}>Editar</button>
                      <button className="form-control primary m-1" onClick={() => handleVerReceta(receta.id_recetas)}>Ver</button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No hay recetas disponibles para esta categoría.
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
};

export default RecetasList;
