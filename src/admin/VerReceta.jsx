import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../url';
import { Button } from '../components/ui/button';
import { Image } from 'react-bootstrap';
import { Clock, ChefHat, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/card';

const Page = () => {
  const { idReceta } = useParams(); // Obtener el id de la receta desde la URL
  const [receta, setReceta] = useState(null); // Estado para almacenar la receta
  const [error, setError] = useState('');

  useEffect(() => {
    // Limpiar los valores cuando la página se recarga
    setReceta(null); // Restablecer el estado antes de cargar la nueva receta

    // Llamar a la API para obtener la receta por idReceta
    axios.get(`${API_BASE_URL}/recetas/${idReceta}`)
      .then((response) => {
        if (response.data && response.data.message) {
          setReceta(response.data.message); // Guardar la receta obtenida
        } else {
          setError('No se encontró la receta.');
        }
      })
      .catch(() => {
        setError('Error en la respuesta del servidor.');
      });
  }, [idReceta]);

  if (!receta) {
    return <div className="text-center text-gray-500">{error ? error : 'Cargando receta...'}</div>;
  }

  // Extraer los datos de la receta
  const { nombre_receta, descripcion, tiempo_preparacion, dificultad, foto, numero_porciones } = receta;

  return (
    <Card className="mx-auto shadow-lg rounded-lg overflow-hidden max-w-4xl">
      <CardHeader className="space-y-6 pb-0">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-center text-gray-800">{nombre_receta}</h1>
          <div className="flex justify-center items-center gap-2">
            <div className="h-1 w-16 bg-red-500" />
            <div className="h-1 w-16 bg-red-500" />
          </div>
        </div>

        <div className="text-center text-gray-600">
          <p className="font-medium">Receta de {receta.autor || "Autor desconocido"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t-2 border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">TIEMPO:</p>
              <p className="font-semibold">{tiempo_preparacion} min</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">DIFICULTAD:</p>
              <p className="font-semibold">{dificultad}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid md:grid-cols-2 gap-6 p-6">
        {/* Comprobar si la foto está disponible antes de intentar cargarla */}
        {foto && (
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={`data:image/png;base64,${foto}`} // Aquí usas la imagen en base64
              alt={nombre_receta}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <p className="text-gray-600 text-lg">{descripcion}</p>

          {/* Mostrar número de porciones solo si es positivo */}
          {numero_porciones > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-700">Porciones</h2>
              <p className="text-lg">{numero_porciones} porciones</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
