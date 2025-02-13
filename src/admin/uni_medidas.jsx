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

  const [showModalEditarFactor, setShowModalEditarFactor] = useState(false); // Modal de edición de factor de conversión
  const [selectedFactor, setSelectedFactor] = useState(null); // Factor seleccionado para editar


  const [unidades, setUnidades] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null); // Unit selected for editing
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const [unidadesPorPagina, setUnidadesPorPagina] = useState(2); // Units per page
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [conversiones, setConversiones] = useState([]); // Para almacenar los factores de conversión
  const [showModalFactores, setShowModalFactores] = useState(false); // Controla el estado del modal
  const [showModalAgregarFactores, setShowModalAgregarFactores] = useState(false); // Controla el estado del modal
  const [dividendo, setDividendo] = useState('');
  const [divisor, setDivisor] = useState('');
  const [mostrarCalculadora, setMostrarCalculadora] = useState(false);



  const handleDividendoChange = (e) => {
    setDividendo(e.target.value);
  };

  const handleDivisorChange = (e) => {
    setDivisor(e.target.value);
  };


  // Esta función se ejecuta al hacer click en "Calcular Factor"
  const calcularFactor = () => {
    if (dividendo && divisor) {
      const resultado = parseFloat(dividendo) / parseFloat(divisor);
      setFactor(resultado);
    } else {
      alert('Por favor, ingrese tanto el dividendo como el divisor.');
    }
  };

  const handleActualizarFactor = (id, factorData) => {
    axios
      .put(`${API_BASE_URL}/conversiones/${id}`, factorData)
      .then((response) => {
        if (response.data.status === 'success') {
          setShowModalFactores(false); // Cierra el modal de edición
          obtenerFactoresConversion(); // Vuelve a obtener los factores de conversión actualizados
        } else {
          setError('Hubo un problema al actualizar el factor de conversión.');
        }
      })
      .catch((error) => {
        console.error('Error al actualizar factor de conversión:', error);
        setError('Hubo un problema al actualizar el factor de conversión.');
      });
  };

  const handleEditarFactorSubmit = (e) => {
    e.preventDefault();
    if (!unidadOrigen || !unidadDestino || !factor) {
      setError('Todos los campos son requeridos.');
      return;
    }

    const factorData = {
      id_unidad_origen: unidadOrigen,
      id_unidad_destino: unidadDestino,
      factor: parseFloat(factor),
    };

    axios
      .put(`${API_BASE_URL}/conversiones/${selectedFactor.id}`, factorData)
      .then((response) => {
        if (response.data.status === 'success') {
          setShowModalEditarFactor(false); // Cerrar modal
          obtenerFactoresConversion(); // Recargar factores de conversión
        } else {
          setError('Hubo un problema al actualizar el factor de conversión.');
        }
      })
      .catch((error) => {
        console.error('Error al actualizar factor de conversión:', error);
        setError('Hubo un problema al actualizar el factor de conversión.');
      });
  };


  const handleEliminarFactor = (id) => {
    axios
      .delete(`${API_BASE_URL}/conversiones/${id}`)
      .then((response) => {
        if (response.data.status === 'success') {
          obtenerFactoresConversion(); // Vuelve a obtener los factores de conversión actualizados
        } else {
          setError('Hubo un problema al eliminar el factor de conversión.');
        }
      })
      .catch((error) => {
        console.error('Error al eliminar factor de conversión:', error);
        setError('Hubo un problema al eliminar el factor de conversión.');
      });
  };


  const obtenerFactoresConversion = () => {
    axios.get(`${API_BASE_URL}/conversiones`)
      .then((response) => {
        console.log(response.data);  // Verifica la estructura de la respuesta
        if (response.data.status === 'success' && response.data.data) {
          setConversiones(response.data.data);  // No es necesario usar un array, solo asigna la respuesta directamente
        } else {
          setError('No se encontraron factores de conversión.');
        }
      })
      .catch((error) => {
        setError('Hubo un problema al obtener los factores de conversión.');
        console.error(error);
      });
    setShowModalFactores(true);  // Abre el modal
  };

  const [unidadOrigen, setUnidadOrigen] = useState('');
  const [unidadDestino, setUnidadDestino] = useState('');
  const [factor, setFactor] = useState('');

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const valueAsNumber = Number(value);  // Convertir el valor a número

    if (name === 'unidad_origen') {
      setUnidadOrigen(valueAsNumber);
    } else if (name === 'unidad_destino') {
      setUnidadDestino(valueAsNumber);
    }
  };

  const handleFactorChange = (e) => {
    setFactor(e.target.value);
  };

  useEffect(() => {
    setError('');
  }, []); // Limpia el error cuando se carga la página


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!unidadOrigen || !unidadDestino || !factor) {
      setError('Todos los campos son requeridos.');
      return;
    }

    const factorData = {
      id_unidad_origen: unidadOrigen,
      id_unidad_destino: unidadDestino,
      factor: parseFloat(factor),
    };

    axios
      .post(`${API_BASE_URL}/conversiones`, factorData)
      .then((response) => {
        if (response.data.status === 'success') {
          obtenerFactoresConversion()
          setShowModalAgregarFactores(false);
          setShowModalFactores(true)
        } else {
          setError('Hubo un problema al agregar el factor de conversión.');
        }
      })
      .catch((error) => {
        console.error('Error al agregar factor de conversión:', error);
        setError('Hubo un problema al agregar el factor de conversión.');
      });
  };



  useEffect(() => {
    axios.get(`${API_BASE_URL}/uni_medidas`)
      .then((response) => {
        if (response.data.status === 200) {
          if (response.data.unidad_medida && Array.isArray(response.data.unidad_medida)) {
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


  const indexOfLastUnidad = (currentPage + 1) * unidadesPorPagina;
  const indexOfFirstUnidad = indexOfLastUnidad - unidadesPorPagina;

  const filteredUnidades = unidades.filter(unidad =>
    unidad?.nombre_unidad?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUnidades = filteredUnidades.slice(indexOfFirstUnidad, indexOfLastUnidad);
  const pageCount = Math.ceil(filteredUnidades.length / unidadesPorPagina);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleEditarFactor = (conversion) => {
    // Verificamos que la conversión tiene los datos necesarios
    if (!conversion || !conversion.unidad_origen || !conversion.unidad_destino || !conversion.factor) {
      setError("Los datos de la conversión son incompletos.");
      return;
    }

    // Establecer los valores en el estado del formulario de edición
    setUnidadOrigen(conversion.unidad_origen.id_unidad_medida);  // Asume que 'id_unidad_medida' es el ID de la unidad
    setUnidadDestino(conversion.unidad_destino.id_unidad_medida);  // Lo mismo aquí
    setFactor(conversion.factor);  // El factor de conversión
    setSelectedFactor(conversion);  // Guardamos la conversión seleccionada para editar
    setShowModalEditarFactor(true);  // Abrimos el modal de edición
  };


  const openModalEditar = (unidad) => {
    setUnidadSeleccionada(unidad);  // Asegúrate de que 'unidad' sea la unidad correcta
    setShowModalEditar(true);  // Establece el estado para mostrar el modal
  };


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

  function AbrirModalAgregarFactor() {
    setShowModalAgregarFactores(true);
  };



  const actualizarUnidad = (Unidad) => {
    setUnidades((prev) =>
      prev.map((unidad_medida) =>
        unidad_medida.id_unidad_medida === Unidad.id_unidad_medida ? Unidad : unidad_medida
      )
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl titulo font-bold tracking-tight">Unidades de Medida</h1>
      </div>
      <p className="titulo font-bold tracking-tight">Gestione las unidades de medida que desea agregar a sus productos, asi como los factores de conversion</p>
      <br />

      <div className="flex justify-between items-center">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar unidad de medida"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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

      <br />

      <div className="mb-2">
        <div className="flex justify-between items-center">
          <Button onClick={() => setShowModal(true)} className=' btn btn-primary'>
            Agregar Unidad
          </Button>
          <Button onClick={obtenerFactoresConversion} className=' btn btn-primary'>
            Obtener factores de conversion
          </Button>
        </div>

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

      {/* MODAL PARA VER FACTORES DE CONVERSION */}
      {showModalFactores && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Factores de Conversión</h2>
            <button onClick={() => setShowModalFactores(false)} className="close-btn">Cerrar</button>
            <button onClick={AbrirModalAgregarFactor} className="btn btn-primary">Agregar </button>
            <table>
              <thead>
                <tr>
                  <th>Unidad Origen</th>
                  <th>Unidad Destino</th>
                  <th>Factor</th>
                  <th>Acciones</th> {/* Nueva columna para acciones */}
                </tr>
              </thead>
              <tbody>
                {conversiones.length > 0 ? (
                  conversiones.map((conversion, index) => (
                    <tr key={index}>
                      <td>{conversion.unidad_origen.nombre_unidad ? conversion.unidad_origen.nombre_unidad : 'Nombre no disponible'}</td>
                      <td>{conversion.unidad_destino.nombre_unidad ? conversion.unidad_destino.nombre_unidad : 'Nombre no disponible'}</td>
                      <td>{conversion.factor}</td>
                      <td>
                        {/* Botón de editar */}
                        {/* Botón de editar */}
                        <Button
                          variant="warning"
                          onClick={() => handleEditarFactor(conversion)} // Aquí pasamos el objeto completo de conversion
                        >
                          Editar
                        </Button>

                        <Button
                          onClick={() => handleEliminarFactor(conversion.id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No hay factores de conversión disponibles.</td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModalAgregarFactores && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setShowModalAgregarFactores(false)} className="close-btn">Cerrar</button>
            <form onSubmit={handleSubmit}>
              <h2>Agregar Factor de Conversión</h2>
              <br />
              <label htmlFor="">Unidad que desea convertir Ej: litros</label>
              <select
                id="unidad_origen"
                name="unidad_origen"
                className="form-control"
                value={unidadOrigen}
                onChange={handleSelectChange}
              >
                <option value="">Seleccione Unidad base</option>
                {unidades.map((unidad) => (
                  <option key={unidad.id_unidad_medida} value={unidad.id_unidad_medida}>
                    {unidad.nombre_unidad ? unidad.nombre_unidad : 'Nombre no disponible'}
                  </option>
                ))}
              </select>
              <br />
              <label htmlFor="">Unidad a la que desea convertir Ej: Mililitros</label>
              <select
                id="unidad_destino"
                name="unidad_destino"
                className="form-control"
                value={unidadDestino}
                onChange={handleSelectChange}
              >
                <option value="">Seleccione la unidad derivada</option>
                {unidades.map((unidad) => (
                  <option key={unidad.id_unidad_medida} value={unidad.id_unidad_medida}>
                    {unidad.nombre_unidad ? unidad.nombre_unidad : 'Nombre no disponible'}
                  </option>
                ))}
              </select>

              <br />

              {/* Botón para mostrar la mini calculadora */}
              <button
                type="button"
                onClick={() => setMostrarCalculadora(!mostrarCalculadora)}
                className="btn btn-secondary"
              >
                Mini Calculadora
              </button>

              {/* Contenedor de la mini calculadora, se muestra solo si mostrarCalculadora es true */}
              {mostrarCalculadora && (
                <div className="calculadora-container" style={{ border: '2px solid #ccc', padding: '15px', marginTop: '10px', backgroundColor: '#f9f9f9' }}>
                  <label>Ingrese el dividendo (Ej: 1 para 1 litro)</label>
                  <input
                    type="number"
                    name="dividendo"
                    placeholder="Ej: 1"
                    value={dividendo}
                    onChange={handleDividendoChange}
                  />
                  <br />

                  <label>Ingrese el divisor (Ej: 1000 para mililitros)</label>
                  <input
                    type="number"
                    name="divisor"
                    placeholder="Ej: 1000"
                    value={divisor}
                    onChange={handleDivisorChange}
                  />
                  <br />
                  <button
                    type="button"
                    onClick={calcularFactor}
                    className="btn btn-secondary"
                  >
                    Calcular Factor
                  </button>
                  <br />
                </div>
              )}

              <label htmlFor="">Factor de Conversión</label>
              <input
                type="number"
                name="factor"
                className="form-control"
                placeholder="Por ej: 1.00"
                value={factor}
                onChange={handleFactorChange}
              />
              <br />
              <button type="submit" className="btn btn-primary">
                Agregar
              </button>

              <p>
                {/* Puedes agregar alguna explicación aquí si lo deseas */}
              </p>
            </form>
          </div>
        </div>
      )}

      {showModalEditarFactor && selectedFactor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Factor de Conversión</h2>
            <button onClick={() => setShowModalEditarFactor(false)} className="close-btn">Cerrar</button>
            <form onSubmit={handleEditarFactorSubmit}>
              <select
                id="unidad_origen"
                name="unidad_origen"
                className="form-control"
                value={unidadOrigen}
                onChange={handleSelectChange}
              >
                <option value="">Seleccione Unidad Origen</option>
                {unidades.map((unidad) => (
                  <option key={unidad.id_unidad_medida} value={unidad.id_unidad_medida}>
                    {unidad.nombre_unidad ? unidad.nombre_unidad : 'Nombre no disponible'}
                  </option>
                ))}
              </select>

              <select
                id="unidad_destino"
                name="unidad_destino"
                className="form-control"
                value={unidadDestino}
                onChange={handleSelectChange}
              >
                <option value="">Seleccione Unidad Destino</option>
                {unidades.map((unidad) => (
                  <option key={unidad.id_unidad_medida} value={unidad.id_unidad_medida}>
                    {unidad.nombre_unidad ? unidad.nombre_unidad : 'Nombre no disponible'}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="factor"
                className="form-control"
                placeholder="Por ej: 1.00"
                value={factor}
                onChange={handleFactorChange}
              />

              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
            </form>
          </div>
        </div>
      )}



    </div>
  );
};

export default UnidadMedidaList;
