import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { motion } from '../components/framer-motion/motion';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const VerReceta = ({ showModalVer, setShowModalVer, receta }) => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Función para redirigir a la página de detalles de la receta
  const handleVerReceta = () => {
    // Asumiendo que la ruta de la receta es algo como "/recetas/:id"
    navigate(`/recetas/${receta.id_recetas}`);
    setShowModalVer(false); // Cierra el modal cuando se redirige
  };

  if (!receta) {
    return <div>Receta no disponible</div>; // Si no hay receta, mostrar mensaje de error
  }

  return (
    <div>
      <Modal
        show={showModalVer}
        onHide={() => setShowModalVer(false)}
        centered
        size="lg"
        dialogClassName="modal-fullscreen"  // Clase personalizada para el modal de pantalla completa
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-lg shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white">
            <h2 className="text-3xl font-semibold mb-2">{receta.nombre_receta}</h2>
          </div>
        </motion.div>

        <Modal.Body className="overflow-y-auto max-h-screen p-4">
          <div className="card shadow-sm rounded overflow-y-auto max-h-full">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center mb-4">
                <img
                  src={`data:image/png;base64,${receta.foto}`}
                  alt={receta.nombre_receta}
                  className="card-img-top rounded mb-4"
                  style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                />
                <h5 className="card-title text-center font-bold text-xl mb-3">{receta.nombre_receta}</h5>
              </div>

              <div className="mb-4">
                <h6 className="text-lg font-medium">Descripción:</h6>
                <p className="text-gray-700">{receta.descripcion}</p>
              </div>

              <div className="mb-4">
                <h6 className="text-lg font-medium">Tiempo de Preparación:</h6>
                <p className="text-gray-700">{receta.tiempo_preparacion} minutos</p>
              </div>

              <div className="mb-4">
                <h6 className="text-lg font-medium">Porciones:</h6>
                <p className="text-gray-700">{receta.numero_porciones}</p>
              </div>

              <div className="mb-4">
                <h6 className="text-lg font-medium">Dificultad:</h6>
                <p className="text-gray-700">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      receta.dificultad === 'Fácil'
                        ? 'bg-green-100 text-green-800'
                        : receta.dificultad === 'Medio'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {receta.dificultad}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => setShowModalVer(false)}>
            Cerrar
          </Button>
          <div>
            <Button variant="primary" className="m-1" onClick={handleVerReceta}>
              Ver
            </Button>
            <Button variant="primary" className="m-1">
              Ingredientes
            </Button>
            <Button variant="primary" className="m-1">
              Pasos
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VerReceta;
