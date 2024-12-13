import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../url'; // Aquí se importa la constante API_BASE_URL
import { Button } from '../components/ui/button';
import { Image } from 'react-bootstrap';
import { Clock, ChefHat } from 'lucide-react';
import ListarIngredientes from '../components/MdListarIngredientes';
import "../styles/m/mstyles.css";

const Page = () => {
  const { idReceta } = useParams();
  const [receta, setReceta] = useState(null);
  const [productos, setProductos] = useState([]); // Ingredientes
  const [pasos, setPasos] = useState([]); // Pasos de la receta
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [ShowModalAgregarIngrediente, setShowModalAgregarIngrediente] = useState(false);
  const [ShowModalAgregarPaso, setShowModalAgregarPaso] = useState(false);
  const [nuevoPaso, setNuevoPaso] = useState({
    paso_numero: 0,
    descripcion: '',
  });

  const abrirModalIngredientes = () => setShowModalAgregarIngrediente(true);
  const cerrarModalIngredientes = () => setShowModalAgregarIngrediente(false);

  const abrirModalAgregarPaso = () => setShowModalAgregarPaso(true);
  const cerrarModalAgregarPaso = () => setShowModalAgregarPaso(false);

  const handlePasoChange = (e) => {
    const { name, value } = e.target;
    setNuevoPaso((prevPaso) => ({
      ...prevPaso,
      [name]: value,
    }));
  };

  const agregarPaso = () => {
    if (!nuevoPaso.paso_numero || !nuevoPaso.descripcion) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const pasoData = {
      id_recetas: idReceta,
      paso_numero: nuevoPaso.paso_numero,
      descripcion: nuevoPaso.descripcion,
    };

    axios
      .post(`${API_BASE_URL}/pasos_receta/`, pasoData)
      .then((response) => {
        if (response.status === 200 && response.data && response.data.paso) {
          // Evitar duplicados en los pasos
          setPasos((prevPasos) => {
            if (!prevPasos.some(paso => paso.paso_numero === response.data.paso.paso_numero)) {
              return [...prevPasos, response.data.paso];
            }
            return prevPasos;
          });
          setNuevoPaso({ paso_numero: '', descripcion: '' });
          cerrarModalAgregarPaso();
          alert('Paso agregado correctamente.');
        } else {
          setError('Error al agregar el paso.');
          cerrarModalAgregarPaso();
        }
      })
      .catch((error) => {
        setError('Error al agregar el paso.');
        cerrarModalAgregarPaso();
      });
  };

  const agregarIngrediente = () => {
    const ingredienteData = {}; // Aquí debes agregar los datos para el ingrediente
    axios
      .post(`${API_BASE_URL}/ingredientes-receta/`, ingredienteData)
      .then((response) => {
        if (response.status === 200 && response.data && response.data.ingrediente) {
          // Evitar duplicados en los ingredientes
          setProductos((prevProductos) => {
            if (!prevProductos.some(producto => producto.id_recetas_producto === response.data.ingrediente.id_recetas_producto)) {
              return [...prevProductos, response.data.ingrediente];
            }
            return prevProductos;
          });
          cerrarModalIngredientes();
          alert('Ingrediente agregado correctamente.');
        } else {
          setError('Error al agregar el ingrediente.');
          cerrarModalIngredientes();
        }
      })
      .catch(() => {
        setError('Error al agregar el ingrediente.');
        cerrarModalIngredientes();
      });
  };

  const recargarDatos = () => {
    setLoading(true);

    // Recargar receta
    axios.get(`${API_BASE_URL}/recetas/${idReceta}`)
      .then((response) => {
        if (response.data && response.data.message) {
          setReceta(response.data.message);
        } else {
          setError('No se encontró la receta.');
        }
      })
      .catch(() => {
        setError('Error en la respuesta del servidor al obtener la receta.');
      });

    // Recargar productos
    axios.get(`${API_BASE_URL}/receta-productos/${idReceta}`)
      .then((response) => {
        if (response.data && response.data.productos) {
          setProductos(response.data.productos);
        } else {
          setError('No se encontraron productos para esta receta.');
        }
      })
      .catch(() => {
        setError('Error al obtener los productos.');
      });

    // Recargar pasos
    axios.get(`${API_BASE_URL}/pasos-receta/${idReceta}`)
      .then((response) => {
        if (response.data && response.data.pasos) {
          setPasos(response.data.pasos || []);
        } else {
          setError('No se encontraron pasos para esta receta.');
        }
      })
      .catch(() => {
        setError('Error al obtener los pasos.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    recargarDatos();
  }, [idReceta]);

  if (loading) {
    return <div className="text-center text-gray-500">Cargando receta...</div>;
  }

  if (!receta) {
    return <div className="text-center text-gray-500">{error ? error : 'Receta no encontrada.'}</div>;
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

      <div className="mt-8">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Ingredientes</h3>
          <div className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-md space-y-4 listado-ingredientes">
            {productos.length > 0 ? (
              <ul className="space-y-2">
                {productos.map((producto) => (
                  <li key={producto.id_recetas_producto}>
                    <div className="flex justify-between items-center">
                      <span>{producto.producto.nombre}</span>: <span>{producto.cantidad} unidades</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay productos para esta receta.</p>
            )}
          </div>
        </div>

        <Button onClick={abrirModalIngredientes} variant="outline">
          Agregar Ingredientes
        </Button>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-900">Pasos</h3>
        <div className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-md space-y-4 listado-pasos">
          {pasos.length > 0 ? (
            <ul className="space-y-2">
              {pasos.map((paso) => (
                <li key={paso.id_paso}>
                  <div className="flex justify-between items-center">
                    <span>Paso {paso.paso_numero}: {paso.descripcion}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay pasos para esta receta.</p>
          )}
        </div>

        <Button onClick={abrirModalAgregarPaso} variant="outline">
          Agregar Paso
        </Button>
        <Button onClick={recargarDatos} variant="outline">
          Actualizar Datos
        </Button>
      </div>

      {ShowModalAgregarPaso && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Agregar Paso a la Receta</h2>
              <button onClick={cerrarModalAgregarPaso}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="space-y-4">
                <input
                  type="number"
                  name="paso_numero"
                  value={nuevoPaso.paso_numero}
                  onChange={handlePasoChange}
                  placeholder="Número de paso"
                  className="input-field"
                />
                <textarea
                  name="descripcion"
                  value={nuevoPaso.descripcion}
                  onChange={handlePasoChange}
                  placeholder="Descripción del paso"
                  className="textarea-field"
                />
                <Button onClick={agregarPaso} variant="primary">Agregar Paso</Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
