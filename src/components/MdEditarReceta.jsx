import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const MdEditarReceta = ({ showModalEditar, setShowModalEditar, receta }) => {
  const [nombre, setNombre] = useState(receta.nombre_receta);
  const [descripcion, setDescripcion] = useState(receta.descripcion);
  
  const handleSubmit = () => {
    // Aquí realizarías la lógica para editar la receta (p. ej., llamar a la API)
    console.log("Receta editada", { nombre, descripcion });
    setShowModalEditar(false);
  };

  return (
    <Modal show={showModalEditar} onHide={() => setShowModalEditar(false)} className='z-50'>
      <Modal.Header closeButton>
        <Modal.Title>Editar {receta.nombre_receta}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nombre</Form.Label>
            <Form.Control 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModalEditar(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MdEditarReceta;
