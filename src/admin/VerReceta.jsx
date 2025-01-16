
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../url';
import { Button } from '../components/ui/button';
import { Image } from 'react-bootstrap';
import { Clock, ChefHat } from 'lucide-react';
import ListarIngredientes from '../components/MdListarIngredientes';
import "../styles/m/mstyles.css";
import Swal from 'sweetalert2'  // Import SweetAlert2


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
  const [ShowModalEditarIngrediente, setShowModalEditarIngrediente] = useState(false);
  const [ingredienteEditando, setIngredienteEditando] = useState(null);

  const [ShowModalEditarPaso, setShowModalEditarPaso] = useState(false);
  const [pasoEditando, setPasoEditando] = useState(null);

  const abrirModalIngredientes = () => setShowModalAgregarIngrediente(true);
  const cerrarModalIngredientes = () => setShowModalAgregarIngrediente(false);
  const abrirModalAgregarPaso = () => setShowModalAgregarPaso(true);
  const cerrarModalAgregarPaso = () => setShowModalAgregarPaso(false);

  const abrirModalEditarPaso = (paso) => {
    setPasoEditando(paso);
    setShowModalEditarPaso(true);
  };

  const cerrarModalEditarPaso = () => {
    setShowModalEditarPaso(false);
    setPasoEditando(null);
  };

  const guardarCambiosPaso = async () => {
    if (!pasoEditando.descripcion) {
      Swal.fire({
        icon: 'question',
        title: 'Agrega una descripcion valida',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación (en milisegundos)
      });

      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/pasos_receta/${pasoEditando.id_paso}`,
        {
          paso_numero: pasoEditando.paso_numero, // Asegúrate de enviar el paso_numero
          descripcion: pasoEditando.descripcion,
        }
      );

      if (response.status === 200) {
        const updatedPasos = pasos.map((paso) => {
          if (paso.id_paso === pasoEditando.id_paso) {
            return { ...paso, descripcion: pasoEditando.descripcion };
          }
          return paso;
        });

        setPasos(updatedPasos);
        setShowModalEditarPaso(false);

        Swal.fire({
          icon: 'success',
          title: 'Paso actualizado',
          text: 'Espere a que se reinicie el navegador',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,  // Duración de la notificación (en milisegundos)
        });


      } else {

        Swal.fire({
          icon: 'question',
          title: 'El paso no se ah creado, posiblemente por un error de red, intentelo de nuevo mas tarde',
          text: error.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación (en milisegundos)
        });
      }
    } catch (error) {
      console.error("Error al actualizar el paso:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error en la respuesta del servidor, conectese a la red de itca',
        text: error.message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación (en milisegundos)
      });
    }
  };

  const abrirEditIngrediente = async (ingrediente) => {
    try {
      // Hacer una llamada a la API para obtener todos los productos activos
      const response = await axios.get(`${API_BASE_URL}/Productosactivos`);

      if (response.status === 200 && response.data && Array.isArray(response.data.productos)) {
        // Buscar el producto correspondiente al id_producto del ingrediente
        const producto = response.data.productos.find(
          (p) => p.id_producto === ingrediente.producto.id_producto
        );

        if (producto) {
          // Actualizar el estado con la información del ingrediente y el nombre del producto
          setIngredienteEditando({
            ...ingrediente,
            nombre: producto.nombre,
            unidad_medida: producto.unidad_medida
          });

          // Mostrar el modal de edición
          setShowModalEditarIngrediente(true);
        } else {
          Swal.fire({
            icon: 'question',
            title: "No se encontró el producto con id " + ingrediente.producto.id_producto,
            text: error.message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,  // Duración de la notificación (en milisegundos)
          });
        }
      } else {
        Swal.fire({
          icon: 'question',
          title: 'La respuesta del servidor no fue la esperada, intentalo de nuevo mas tarde',
          text: error.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación (en milisegundos)
        });
      }
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error en la respuesta del servidor, conectese a la red de itca',
        text: error.message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación (en milisegundos)
      });
    }
  };

  const cerrarModalEditarIngrediente = () => {
    setShowModalEditarIngrediente(false); // Cierra el modal
    setIngredienteEditando(null); // Restablece el ingrediente editando
  };

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
  const valorCostoUnitario = 1;

  const guardarCambiosIngrediente = async () => {
    // Validar que la cantidad sea un número válido y mayor que 0
    if (!ingredienteEditando.cantidad || isNaN(ingredienteEditando.cantidad) || ingredienteEditando.cantidad <= 0) {

      Swal.fire({
        icon: 'question',
        title: 'Por favor, ingrese una cantidad válida (mayor que 0).',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación (en milisegundos)
      }); return;
    }

    try {
      // Enviar los cambios a la API
      const response = await axios.put(
        `${API_BASE_URL}/receta_producto/${ingredienteEditando.id_recetas_producto}`, // Endpoint para actualizar el ingrediente
        {
          cantidad: ingredienteEditando.cantidad, // Enviar la nueva cantidad
        }
      );

      if (response.status === 200) {
        // Actualizar el estado local solo si la API responde con éxito
        const updatedIngredientes = productos.map((producto) => {
          if (producto.id_recetas_producto === ingredienteEditando.id_recetas_producto) {
            return ingredienteEditando; // Actualiza el ingrediente editado
          }
          return producto;
        });

        setProductos(updatedIngredientes); // Actualiza el estado con los nuevos ingredientes
        setShowModalEditarIngrediente(false); // Cierra el modal

        Swal.fire({
          icon: 'success',
          title: 'Receta editada',
          text: 'Espere a que se reinicie el navegador',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,  // Duración de la notificación (en milisegundos)
        });


      } else {

        Swal.fire({
          icon: 'error',
          title: 'Error en la respuesta del servidor, intentelo de nuevo mas tarde',
          text: error.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación (en milisegundos)
        });
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error);

      Swal.fire({
        icon: 'error',
        title: 'Error en la respuesta del servidor, conectese a la red de itca',
        text: error.message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación (en milisegundos)
      });
    }
  };

  const actualizarProducto = async (idProducto, cantidadUsada) => {
    try {
      const idUsuario = localStorage.getItem('id'); // Recuperamos el id del usuario de localStorage

      // Verificar si el id_usuario existe en localStorage
      if (!idUsuario) {
        Swal.fire({
          icon: 'question',
          title: 'Debes haber iniciado sesión correctamente, tu id no lo hemos podido recuperar, asegurate de iniciar sesion nuevamente',
          text: error.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación (en milisegundos)
        });
        return;
      }

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

        Swal.fire({
          icon: 'success',
          title: `Se restó correctamente para el stock del producto ${idProducto}.`,
          text: 'Espere a que se reinicie el navegador',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,  // Duración de la notificación (en milisegundos)
        });
      } else {

        Swal.fire({
          icon: 'question',
          title: `Hubo un error al registrar el egreso: ${response.statusText}`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.error('Error al registrar el egreso:', error);

      if (error.response) {
        console.log('Detalles de la respuesta:', error.response.data);
        Swal.fire({
          icon: 'error',
          title: 'Error en la respuesta del servidor, conectese a la red de itca',
          text: error.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación (en milisegundos)
        });
      } else if (error.request) {
        console.log('No hubo respuesta del servidor:', error.request);
        Swal.fire({
          icon: 'error',
          title: 'Error en la respuesta del servidor, conectese a la red de itca',
          text: error.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación (en milisegundos)
        });
      } else {
        console.log('Error al configurar la solicitud:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error en la respuesta del servidor, conectese a la red de itca',
          text: error.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación (en milisegundos)
        });
      }
      throw error;
    }
  };


  const verificarStockProductos = async () => {
    try {
      const productosValidos = await Promise.all(
        productos.map(async (producto) => {
          console.log("Producto actual:", producto);

          // Hacer la solicitud a la API
          const response = await axios.get(`${API_BASE_URL}/productos/${producto.producto.id_producto}`);

          // Acceder al stock correctamente
          const stockActual = response.data.message.stock;
          const cantidadNecesaria = producto.cantidad * formPlato.cantidad_platos;
          const esValido = stockActual >= cantidadNecesaria ? 1 : 0;

          return {
            id_producto: producto.producto.id_producto,
            cantidadUsada: cantidadNecesaria,
            esValido: esValido,
          };
        })
      );

      return productosValidos;
    } catch (error) {
      console.error('Error al verificar el stock:', error);
      throw error;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    // Validación de campos vacíos
    if (!formPlato.nombre || formPlato.precio <= 0 || !formPlato.precio || formPlato.cantidad_platos <= 0 || !formPlato.cantidad_platos || !formPlato.descripcion) {
      Swal.fire({
        icon: 'question',
        title: 'Rellene todos los campos',
        text: 'Si todos los campos estan llenos, verifique que el precio sea mayor a 0 y que la cantidad de platos a crear sea mayor a 0',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
      });

      return;
    }

    try {


      const productosValidos = await verificarStockProductos();

      // Verificar si todos los productos tienen suficiente stock
      const hayStockInsuficiente = productosValidos.some((producto) => producto.esValido === 0);

      if (hayStockInsuficiente) {
        // Mostrar un mensaje de error si no hay suficiente stock
        Swal.fire({
          icon: 'question',
          title: 'Inventario insuficiente.',
          text: 'No hay suficiente stock para uno o más productos. No se creará el plato.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,  // Duración de la notificación (en milisegundos)
        });

        return; // Detener el proceso si no hay suficiente stock
      }


      // Paso 1: Usar los productos de la receta para calcular el stock a actualizar
      const productosUsados = productos.map((producto) => {
        const cantidadUsada = producto.cantidad * formPlato.cantidad_platos; // Calculamos la cantidad usada por la receta
        return { id_producto: producto.producto.id_producto, cantidadUsada };
      });

      // Validación después de mapear
      if (productosUsados.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Ingredientes inexistentes',
          text: 'No hay productos válidos en la receta o no se pudo calcular la cantidad usada.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
        });
        return; // Detener el proceso si no hay productos procesados
      }
      // Paso 2: Actualizamos el stock de cada producto utilizando el ingreso
      for (const producto of productosUsados) {
        await actualizarProducto(producto.id_producto, producto.cantidadUsada);
      }

      // Paso 3: Crear el plato (ahora se hace de último)
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
          img: formPlato.imagenBase64,
        }),
      });

      if (response.ok) {

        Swal.fire({
          icon: 'success',
          title: 'Plato creado con exito',
          text: 'Espere a que se reinicie el navegador',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000); // 1000 milisegundos = 1 segundo
      } else {

        Swal.fire({
          icon: 'error',
          text: 'El plato no se creo por un posible error en la carga del servidor',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });

      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        text: `Error en a respuesta del servidor, conectate a la red de itca, posible: ${error.message}`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };


  const handlePasoChange = (e) => {
    const { name, value } = e.target;
    setNuevoPaso((prevPaso) => ({ ...prevPaso, [name]: value }));
  };

  const agregarPaso = () => {
    // Validar que el número de paso sea un número válido y mayor que 0
    if (isNaN(nuevoPaso.paso_numero) || nuevoPaso.paso_numero <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Número de paso inválido',
        text: 'El número de paso debe ser un valor numérico mayor que 0.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Validar que la descripción no esté vacía ni contenga solo espacios en blanco
    if (!nuevoPaso.descripcion || !nuevoPaso.descripcion.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Descripción inválida',
        text: 'La descripción no puede estar vacía o contener solo espacios en blanco.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Si pasa las validaciones, crear el objeto pasoData
    const pasoData = {
      id_recetas: idReceta,
      paso_numero: nuevoPaso.paso_numero,
      descripcion: nuevoPaso.descripcion.trim(), // Eliminar espacios en blanco al inicio y al final
    };

    // Enviar los datos a la API
    axios.post(`${API_BASE_URL}/pasos_receta`, pasoData)
      .then((response) => {
        if (response.status === 201 && response.data) {
          setPasos((prevPasos) => [...prevPasos, response.data]);
          setNuevoPaso({ paso_numero: '', descripcion: '' }); // Reiniciar el formulario
          Swal.fire({
            icon: 'success',
            title: 'Paso agregado',
            text: 'Paso agregado satisfactoriamente.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
          });
          setShowModalAgregarPaso(false); // Cerrar el modal
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error en la respuesta del servidor',
            text: 'No se pudo agregar el paso. Inténtalo de nuevo más tarde.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          });
        }
      })
      .catch((error) => {
        console.error('Error al agregar el paso:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar el paso',
          text: 'Asegúrate de estar conectado a la red de ITCA.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      });
  };

  const recargarDatos = () => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/receta/${idReceta}`)
      .then((response) => {
        setReceta(response.data.receta || {});
        setformPlato((prevForm) => ({
          ...prevForm,
          nombre: response.data.receta.nombre_receta || '',
          descripcion: response.data.receta.descripcion || '',
          imagenBase64: response.data.receta.foto || '',
        }));
        // Aquí se almacenan los productos de la receta
        setProductos(response.data.receta.receta_productos || []);
      })
      .catch(() => setError(Swal.fire({
        icon: 'error',
        title: 'Error al obtener la receta, asegurese de estar conectado a la red de itca',
        text: error.message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,  // Duración de la notificación (en milisegundos)
      })));

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
          setError(Swal.fire({
            icon: 'question',
            title: 'No se obtuvieron productos, no hay o no se estan cargando correctamente, verifique si esta conectada a la red de itca',
            text: error.message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,  // Duración de la notificación (en milisegundos)
          }));
        }
      });

    axios.get(`${API_BASE_URL}/receta/${idReceta}`)
      .then((response) => setProductos(response.data.recetas.receta_productos || []))
      .catch(() => setError())
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
            </div>

          </div>
        </div>
      </div>
      <button type="button" className="form-control" onClick={openModal}>
        Click aqui para generar plato de esta receta
      </button>

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
                      <span>{producto.producto.nombre}</span>: <span>{producto.cantidad} en {producto.producto.unidad_medida.nombre_unidad}</span> <span>
                        <button className='form-control' onClick={() => abrirEditIngrediente(producto)}>Editar ingrediente</button>
                      </span>
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
                    <span>
                      <button className='form-control' onClick={() => abrirModalEditarPaso(paso)}>Editar paso</button>
                    </span>

                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay pasos para esta receta.</p>
          )}
        </div>

        <Button onClick={recargarDatos} variant="outline" className="mt-4">
          .:.:.:
        </Button>
      </div>

      {ShowModalEditarPaso && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar Paso {pasoEditando.paso_numero}</h2>
              <button onClick={cerrarModalEditarPaso}>&times;</button>
            </div>
            <div className="modal-body">
              {pasoEditando && (
                <div className="space-y-4">
                  <label htmlFor="descripcionPaso" className="label-form">Descripción</label>
                  <textarea
                    id="descripcionPaso"
                    value={pasoEditando.descripcion}
                    onChange={(e) => setPasoEditando({ ...pasoEditando, descripcion: e.target.value })}
                    className="form-control"
                  />

                  {/* Botón para guardar los cambios */}
                  <Button onClick={guardarCambiosPaso} variant="primary">Guardar Cambios</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {ShowModalEditarIngrediente && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar Ingrediente: {ingredienteEditando.nombre}</h2>
              <button onClick={cerrarModalEditarIngrediente}>&times;</button>
            </div>
            <div className="modal-body">
              {ingredienteEditando && (
                <div className="space-y-4">
                  <p><strong>Unidad de medida:</strong> {ingredienteEditando.unidad_medida}</p>

                  <label htmlFor="cantidadIngrediente" className="label-form">Cantidad</label>
                  <input
                    id="cantidadIngrediente"
                    type="number"
                    value={ingredienteEditando.cantidad}
                    onChange={(e) => setIngredienteEditando({ ...ingredienteEditando, cantidad: e.target.value })}
                    className="form-control"
                  />

                  <Button onClick={guardarCambiosIngrediente} variant="primary">Guardar Cambios</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


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
                      className="form-control"

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
