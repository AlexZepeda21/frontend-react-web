import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
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
import { useParams } from 'react-router-dom'; // Para obtener el ID de la categoría desde la URL

const RecetasList = () => {
  const { categoriaId } = useParams(); // Obtener el id de la categoría desde la URL
  const [recetas, setRecetas] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Usamos el categoriaId para hacer la solicitud a la API
    axios.get(`${API_BASE_URL}/recetas?categoria_id=${categoriaId}`)
      .then((response) => {
        if (response.data && response.data.recetas) {
          setRecetas(response.data.recetas);
        } else {
          setError('No se encontraron recetas para esta categoría.');
        }
      })
      .catch((error) => {
        setError('Hubo un problema al cargar las recetas.');
      });
  }, [categoriaId]); // Este hook se ejecutará cada vez que el categoriaId cambie

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Lista de Recetas</h1>
        <br />
      </div>
      <div>
        <Button onClick={() => setShowModal(true)} size="lg" className='m-1'>
          Agregar Receta
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showModal && (
        <MdAgregarRecetas showModal={showModal} setShowModal={setShowModal} />
      )}

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="max-w-[300px]">Descripción</TableHead>
              <TableHead>Tiempo</TableHead>
              <TableHead>Porciones</TableHead>
              <TableHead>Dificultad</TableHead>
              <TableHead>Foto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Opciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recetas.length > 0 ? (
              recetas.map((receta) => (
                <TableRow
                  key={receta.id_recetas}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{receta.id_recetas}</TableCell>
                  <TableCell>{receta.nombre_receta}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="truncate" title={receta.descripcion}>
                      {receta.descripcion}
                    </p>
                  </TableCell>
                  <TableCell>{receta.tiempo_preparacion} min</TableCell>
                  <TableCell>{receta.numero_porciones}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${receta.dificultad === "Fácil"
                          ? "bg-green-100 text-green-800"
                          : receta.dificultad === "Medio"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {receta.dificultad}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                      <img
                        src={`data:image/png;base64,${receta.foto}`}
                        alt={receta.nombre_receta}
                        className="h-full w-full object-cover transition-transform hover:scale-110"
                      />

                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${receta.estado
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {receta.estado ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={""}
                    >
                      <button className='form-control primary m-1'>Editar</button>
                      <button className='form-control primary m-1'>Ver</button>
                    </span>
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
  );
};

export default RecetasList;