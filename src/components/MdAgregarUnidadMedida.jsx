import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { API_BASE_URL } from '../url';
import Swal from 'sweetalert2';

const MdAgregarUnidadMedida = ({ showModal, setShowModal,agregarUnidadMedida }) => {
  const [nombre, setNombre] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nombre.trim() === '') {
      Swal.fire("Error", "El nombre de la unidad no puede estar vacío.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/uni_medidas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_unidad: nombre.trim(),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          title: 'Éxito!',
          text: 'Unidad de medida creada con éxito!',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        agregarUnidadMedida(result.message)
        setShowModal(false);
        setNombre('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la unidad de medida');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Unidad de Medida</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Kilogramos"
              maxLength={50}
              required
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar Unidad'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MdAgregarUnidadMedida;
