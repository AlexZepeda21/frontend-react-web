import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../url';
import { Button } from '../components/ui/button';
import { Image } from 'react-bootstrap';
import { Clock, ChefHat } from 'lucide-react';
import ListarIngredientes from '../components/MdListarIngredientes';

const Page = () => {
  const { idReceta } = useParams(); // Obtener el ID de la receta desde los parámetros
  const [receta, setReceta] = useState(null);
  const [error, setError] = useState('');
  const [ShowModalAgregarIngrediente, setShowModalAgregarIngrediente] = useState(false);

  // Función para abrir el modal de ingredientes
  const abrirModalIngredientes = () => {
    setShowModalAgregarIngrediente(true);
  };

  // Función para cerrar el modal de ingredientes
  const cerrarModalIngredientes = () => {
    setShowModalAgregarIngrediente(false);
  };

  useEffect(() => {
    setReceta(null);  // Limpiar receta al cargar un nuevo ID

    // Obtener detalles de la receta por ID
    axios.get(`${API_BASE_URL}/recetas/${idReceta}`)
      .then((response) => {
        if (response.data && response.data.message) {
          setReceta(response.data.message);
        } else {
          setError('No se encontró la receta.');
        }
      })
      .catch(() => {
        setError('Error en la respuesta del servidor.');
      });

  }, [idReceta]); // Dependencia en `idReceta` para que se ejecute cada vez que cambie el ID

  if (!receta) {
    return <div className="text-center text-gray-500">{error ? error : 'Cargando receta...'}</div>;
  }

  const { nombre_receta, descripcion, tiempo_preparacion, dificultad, foto, numero_porciones, estado } = receta;

  return (
    <div className="bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8 bg-gray-100 p-8 rounded-lg shadow-md">
            <header className="text-center space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">{nombre_receta}</h1>
              <div className="flex justify-center items-center">
                <div className="w-32 h-1">
                  <svg className="w-full h-full">
                    <path
                      d="M0,5 Q25,0 500,5 T100,5"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="10"
                    />
                  </svg>
                </div>
              </div>
            </header>

            <div className="space-y-4">
              <p className="text-base font-medium hover:underline cursor-pointer text-gray-600">
                {receta.autor || "Autor desconocido"}
              </p>
              <time className="text-sm text-gray-500">{new Date().toLocaleDateString()}</time>
            </div>

            <div className="flex justify-center gap-12">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-full">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Tiempo</p>
                  <p className="font-semibold">{tiempo_preparacion} min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-full">
                  <ChefHat className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Dificultad</p>
                  <p className="font-semibold">{dificultad}</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-gray-600 text-lg leading-relaxed">{descripcion}</p>
            </div>

            <div className="flex justify-between mt-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Porciones</h2>
                <p className="text-lg text-gray-600">{numero_porciones}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Estado</h2>
                <p className="text-lg text-gray-600">{estado ? "Activo" : "Inactivo"}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-lg">
              {foto && (
                <Image
                  src={`data:image/png;base64,${foto}`}
                  alt={nombre_receta}
                  fluid
                  className="object-cover w-full h-auto rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botón para abrir el modal de ingredientes */}
      <div className="mt-8">
        <Button onClick={abrirModalIngredientes} variant="outline">
          Agregar Ingredientes
        </Button>
      </div>

      {/* Modal para agregar ingredientes */}
      {ShowModalAgregarIngrediente && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Agregar Ingredientes a la Receta</h2>
              <button onClick={cerrarModalIngredientes}>&times;</button>
            </div>
            <div className="modal-body">
              <ListarIngredientes idReceta={idReceta} /> {/* Se pasa el idReceta al componente de ListarIngredientes */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
