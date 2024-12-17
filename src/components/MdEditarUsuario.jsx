import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../url";

const MdEditarUsuario = ({ showModalEditar, setShowModalEditar, usuario }) => {
  const [correo, setCorreo] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState(3); // Por defecto: Usuario normal
  const [activo, setActivo] = useState(true); // Estado del usuario (activo/inactivo)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setCorreo(usuario.correo || "");
      setNuevaClave(""); // Limpiamos el campo de clave al cargar
      setTipoUsuario(Number(usuario.id_tipo_usuario) || 3);
      setActivo(usuario.activo === 1); // Si activo es 1, el switch está encendido
    }
  }, [usuario]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (correo.trim() === "") {
      Swal.fire("Error", "El correo no puede estar vacío.", "error");
      return;
    }

    setLoading(true);

    try {
      // Construimos el payload a enviar
      const payload = {
        correo,
        tipo_usuario: tipoUsuario,
        estado: activo ? 1 : 0, // Enviamos 1 si activo, 0 si inactivo
        ...(nuevaClave && { clave: nuevaClave }), // Solo incluimos clave si se define
      };

      const response = await axios.put(
        `${API_BASE_URL}/user/${usuario.id_usuario}`,
        payload
      );

      if (response.data.status === 200) {
        Swal.fire("Actualizado", "El usuario se actualizó correctamente.", "success");
        setShowModalEditar(false); // Cerramos el modal
      } else {
        Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      Swal.fire("Error", "Ocurrió un problema al actualizar el usuario.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModalEditar(false);
    setNuevaClave(""); // Limpiamos la clave al cerrar
  };

  return (
    <Modal show={showModalEditar} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Usuario</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleUpdate}>
        <Modal.Body>
          {/* Correo */}
          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ingrese el correo del usuario"
              required
            />
          </Form.Group>

          {/* Nueva Clave */}
          <Form.Group className="mb-3">
            <Form.Label>Nueva Clave</Form.Label>
            <Form.Control
              type="password"
              value={nuevaClave}
              onChange={(e) => setNuevaClave(e.target.value)}
              placeholder="Ingrese una nueva clave (opcional)"
            />
            <Form.Text className="text-muted">
              Deje en blanco si no desea cambiar la clave.
            </Form.Text>
          </Form.Group>

          {/* Tipo de Usuario */}
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Usuario</Form.Label>
            <Form.Select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(Number(e.target.value))}
            >
              <option value={1}>Administrador</option>
              <option value={2}>Chef</option>
             
            </Form.Select>
          </Form.Group>

          {/* Switch Activo */}
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Label className="me-3">Estado del Usuario</Form.Label>
            <Form.Check
              type="switch"
              id="switch-activo"
              checked={activo}
              onChange={() => setActivo(!activo)}
              label={activo ? "Activo" : "Inactivo"}
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

export default MdEditarUsuario;
