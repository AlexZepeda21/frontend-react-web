import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../url";

const MdEditarUnidadMedida = ({ showModalEditar, setShowModalEditar, unidad }) => {
  const [nombreUnidad, setNombreUnidad] = useState(unidad.nombre_unidad || "");
  const [estado, setEstado] = useState(unidad.estado || 1);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (nombreUnidad.trim() === "") {
      Swal.fire("Error", "El nombre de la unidad no puede estar vacío.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${API_BASE_URL}/uni_medidas/${unidad.id_unidad_medida}`, {
        nombre_unidad: nombreUnidad,
        estado: Number(estado),
      });

      if (response.data.status === 200) {
        Swal.fire("Actualizado", "La unidad de medida se actualizó correctamente.", "success");
        setShowModalEditar(false);
      } else {
        Swal.fire("Error", "No se pudo actualizar la unidad de medida.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Ocurrió un problema al actualizar la unidad.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShowModalEditar(false);

  return (
    <Modal show={showModalEditar} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Unidad de Medida</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleUpdate}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Unidad</Form.Label>
            <Form.Control
              type="text"
              value={nombreUnidad}
              onChange={(e) => setNombreUnidad(e.target.value)}
              placeholder="Ingrese el nombre de la unidad"
              required
            />
          </Form.Group>

           <Form.Group controlId="formEstado" className="mb-3">
          <Form.Label className="me-3 mb-0">Estado</Form.Label>
          <Form.Check
            type="switch"
            id="estado-switch"
            label={estado === 1 ? "Activo" : "Inactivo"}
            checked={estado === 1}
            onChange={() => setEstado(estado === 1 ? 0 : 1)} // Alterna entre 1 (activo) y 0 (inactivo)
          />
        </Form.Group>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MdEditarUnidadMedida;