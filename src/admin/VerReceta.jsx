
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../url';
import { Button } from '../components/ui/button';
import { Image } from 'react-bootstrap';
import { Clock, ChefHat } from 'lucide-react';
import ListarIngredientes from '../components/MdListarIngredientes';
import "../styles/m/mstyles.css";

const Page = () => {
  const { idReceta } = useParams();
  const [receta, setReceta] = useState(null);
  const [productos, setProductos] = useState([]);
  const [pasos, setPasos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [ShowModalAgregarIngrediente, setShowModalAgregarIngrediente] = useState(false);
  const [ShowModalAgregarPaso, setShowModalAgregarPaso] = useState(false);
  const [nuevoPaso, setNuevoPaso] = useState({ paso_numero: 0, descripcion: '' });
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal básico

  const abrirModalIngredientes = () => setShowModalAgregarIngrediente(true);
  const cerrarModalIngredientes = () => setShowModalAgregarIngrediente(false);
  const abrirModalAgregarPaso = () => setShowModalAgregarPaso(true);
  const cerrarModalAgregarPaso = () => setShowModalAgregarPaso(false);
  const [formPlato, setformPlato] = useState({
    nombre: '',
    precio: '',
    cantidad_platos: '',
    descripcion: '',
    estado: true,
    imagenBase64: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setformPlato((prevForm) => ({
          ...prevForm,
          imagenBase64: reader.result.split(',')[1], // Obtienes solo la parte base64 del archivo
        }));
      };
      reader.readAsDataURL(file); // Lee el archivo como URL de datos
    }
  };

  const imagePreview = formPlato.imagenBase64
    ? `data:image/png;base64,${formPlato.imagenBase64}`
    : receta?.foto
      ? `data:image/png;base64,${receta.foto}` // Si no se ha cargado una nueva imagen, usar la imagen de la receta
      : '';



  const TIPO_MOVIMIENTO = "Creación de plato";
  const valorCostoUnitario= 1;

  const actualizarProducto = async (idProducto, cantidadUsada) => {
    try {
      const idUsuario = localStorage.getItem('id'); // Recuperamos el id del usuario de localStorage

      // Verificar si el id_usuario existe en localStorage
      if (!idUsuario) {
        alert('No se encontró el id de usuario en el almacenamiento local.');
        return;
      }

      // Generamos el objeto para enviar a la API de "ingreso"
      const ingresoData = {
        id_producto: idProducto,
        cantidad: cantidadUsada,
        tipo_movimiento: TIPO_MOVIMIENTO,
        id_usuario: idUsuario,
        costo_unitario: valorCostoUnitario, // Asegúrate de agregar esto aquí
      };
      
      console.log('Ingreso Data:', ingresoData); // Verifica lo que se está enviando al servidor

      // Enviamos el POST a la API de ingreso
      const response = await axios.post(`${API_BASE_URL}/ingreso`, ingresoData);

      if (response.status === 201) {
        alert(`Se restó correctamente para el stock del producto ${idProducto}.`);
      } else {
        alert(`Hubo un error al registrar el egreso: ${response.statusText}`);
      }
    } // En el bloque catch de la función actualizarProducto
    catch (error) {
      console.error('Error al registrar el egreso:', error);
      
      if (error.response) {
        // Aquí convertimos el objeto en un string legible con JSON.stringify
        console.log('Detalles de la respuesta:', error.response.data);
        alert(`Detalles del error: ${JSON.stringify(error.response.data)}`); // Muestra el mensaje de error detallado
      } else if (error.request) {
        console.log('No hubo respuesta del servidor:', error.request);
        alert('No hubo respuesta del servidor. Por favor, intente más tarde.');
      } else {
        console.log('Error al configurar la solicitud:', error.message);
        alert(`Error al configurar la solicitud: ${error.message}`);
      }
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!formPlato.nombre || !formPlato.precio || !formPlato.cantidad_platos || !formPlato.descripcion) {
      alert('Por favor, complete todos los campos antes de enviar.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formPlato.nombre,
          precio: formPlato.precio,
          cantidad_platos: formPlato.cantidad_platos,
          descripcion: formPlato.descripcion,
          estado: formPlato.estado,
          img: formPlato.imagenBase64, // Enviar la imagen de la receta
        }),
      });

      if (response.ok) {
        alert('Plato creado con éxito!');

        // Paso 1: Usamos los productos de la receta para calcular el stock a actualizar
        const productosUsados = productos.map((producto) => {
          const cantidadUsada = producto.cantidad * formPlato.cantidad_platos; // Calculamos la cantidad usada por la receta
          return { id_producto: producto.producto.id_producto, cantidadUsada };
        });

        // Paso 2: Actualizamos el stock de cada producto utilizando el ingreso
        for (const producto of productosUsados) {
          await actualizarProducto(producto.id_producto, producto.cantidadUsada);
        }
      } else {
        throw new Error('Error al crear el plato.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Hubo un error al crear el plato: ${error.message}`);
    }
  };






  const handlePasoChange = (e) => {
    const { name, value } = e.target;
    setNuevoPaso((prevPaso) => ({ ...prevPaso, [name]: value }));
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

    axios.post(`${API_BASE_URL}/pasos_receta`, pasoData)
      .then((response) => {
        if (response.status === 201 && response.data) {
          setPasos((prevPasos) => [...prevPasos, response.data]);
          setNuevoPaso({ paso_numero: '', descripcion: '' });
          alert('Paso agregado correctamente.');
          setShowModalAgregarPaso(false);
        } else {
          setError('Error al agregar el paso.');
        }
      })
      .catch(() => setError('Error al agregar el paso.'));
  };

  const recargarDatos = () => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/recetas/${idReceta}`)
      .then((response) => {
        setReceta(response.data.message || {});
        setformPlato((prevForm) => ({
          ...prevForm,
          nombre: response.data.message.nombre_receta || '',
          descripcion: response.data.message.descripcion || '',
          imagenBase64: response.data.message.foto || '',
        }));
      })
      .catch(() => setError('Error al obtener la receta.'));

    axios.get(`${API_BASE_URL}/pasos-receta/${idReceta}`)
      .then((response) => {
        if (response.status === 200) {
          setPasos(response.data.pasos || []);
        } else {
          setPasos([]);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setPasos([]);
        } else {
          setError('Error al obtener los pasos.');
        }
      });

    axios.get(`${API_BASE_URL}/receta-productos/${idReceta}`)
      .then((response) => setProductos(response.data.productos || []))
      .catch(() => setError('Error al obtener los productos.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    recargarDatos();
  }, [idReceta]);

  useEffect(() => {
    if (pasos.length > 0) {
      const ultimoPaso = pasos[pasos.length - 1];
      setNuevoPaso((prevPaso) => ({
        ...prevPaso,
        paso_numero: ultimoPaso.paso_numero + 1,
      }));
    } else {
      setNuevoPaso((prevPaso) => ({
        ...prevPaso,
        paso_numero: 1,
      }));
    }
  }, [pasos]);

  if (loading) return <div className="text-center text-gray-500">Cargando receta...</div>;

  if (!receta) return <div className="text-center text-gray-500">{error || 'Receta no encontrada.'}</div>;

  const { nombre_receta, descripcion, tiempo_preparacion, dificultad, foto, numero_porciones, estado } = receta;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gray-50 py-12 px-6 md:px-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8 bg-gray-100 p-8 rounded-lg shadow-md">
            <header className="text-center space-y-6">
              <h1 className="text-4xl font-bold text-gray-900">{nombre_receta}</h1>
              <div className="w-32 h-1 mx-auto mb-6">
                <svg className="w-full h-full">
                  <path d="M0,5 Q25,0 500,5 T100,5" fill="none" stroke="#EF4444" strokeWidth="10" />
                </svg>
              </div>
            </header>

            <div className="space-y-4">
              <p className="text-base font-medium cursor-pointer text-gray-600">
                Que tal {localStorage.getItem("correo") || "Tu"} quieres preparar esta receta
              </p>
              <time className="text-sm text-gray-500"> Hoy es {new Date().toLocaleDateString()}</time>
            </div>

            <div className="flex justify-center gap-12">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-full">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Tiempo</p>
                  <p className="font-semibold">{tiempo_preparacion} min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-full">
                  <ChefHat className="w-5 h-5 text-gray-600" />
                </div>
                <div>
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
              {foto && <Image src={`data:image/png;base64,${foto}`} alt={nombre_receta} fluid className="object-cover w-full h-auto rounded-lg shadow-lg" />}
            </div>
            <div>
              <button type="button" className="btn btn-success" onClick={openModal}>
                Generar plato de esta receta
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Ingredientes</h3>
          <Button onClick={abrirModalIngredientes} variant="outline" className="mt-4">
            Agregar Ingredientes
          </Button>
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
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-gray-900">Pasos</h3>
        <Button onClick={abrirModalAgregarPaso} variant="outline" className="mt-4">
          Agregar Paso
        </Button>
        <div className="bg-white p-4 border-2 border-gray-300 rounded-lg shadow-md space-y-4 listado-ingredientes">
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

        <Button onClick={recargarDatos} variant="outline" className="mt-4">
          Actualizar Datos
        </Button>
      </div>

      {/* Modal para agregar paso */}
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
                  readOnly
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
              <ListarIngredientes idReceta={idReceta} />
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar plato */}
      {isModalOpen && (
        <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Agregar Platos a la receta</h5>
                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>

                  {/* Este campo ahora no será editable */}
                  <div className="mb-4">
                    <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">Imagen</label>
                    <input
                      id="imagen"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full mt-1"

                    />
                    {/* Solo mostrar la imagen si existe */}
                    {imagePreview && <img src={imagePreview} alt="Vista previa" className="mt-4 w-full h-48 object-cover rounded-md" />}
                  </div>

                  <label htmlFor="nombre" className="label-form">Nombre del plato</label>
                  <input
                    type="text"
                    value={formPlato.nombre}
                    name="nombre"
                    onChange={(e) => setformPlato({ ...formPlato, nombre: e.target.value })}
                    className="form-control"
                  />
                  <br />
                  <label htmlFor="precio" className="label-form">Precio en $</label>
                  <input
                    type="number"
                    value={formPlato.precio}
                    name="precio"
                    onChange={(e) => setformPlato({ ...formPlato, precio: e.target.value })}
                    className="form-control"
                    placeholder='Por ej: 1.00'
                  />
                  <br />
                  <label htmlFor="cantidad" className="label-form">Cantidad de platos</label>
                  <input
                    type="number"
                    step="1"
                    value={formPlato.cantidad_platos}
                    name="cantidad_platos"
                    onChange={(e) => setformPlato({ ...formPlato, cantidad_platos: e.target.value })}
                    className="form-control"
                    placeholder='Por ej: 4'
                  />
                  <br />
                  <label htmlFor="descripcion" className="label-form">Descripción</label>
                  <textarea
                    value={formPlato.descripcion}
                    name="descripcion"
                    onChange={(e) => setformPlato({ ...formPlato, descripcion: e.target.value })}
                    className="form-control"
                  />
                  <Button className="m-2">Preparar</Button>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
