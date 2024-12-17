import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Generador_de_codigo from '../QR/Generador_de_codigo';
import { API_BASE_URL } from '../url';

const ImageUploader = ({ receta, image, handleFileChange }) => (
  <div className="form-group">
    <label className="image-upload">
      {image || receta.foto ? (
        <img
          src={image ? image : `data:image/png;base64,${receta.foto}`}
          alt="Previsualización de imagen"
          className="upload-preview w-20 h-20 object-cover rounded"
        />
      ) : (
        <span className="upload-placeholder text-center text-sm">Subir Imagen</span>
      )}
      <input
        type="file"
        className="file-input"
        accept="image/*"
        onChange={handleFileChange}
      />
    </label>
  </div>
);

const MdEditarReceta = ({ showModalEditar, setShowModalEditar, receta, actualizarReceta }) => {
  const [nombre, setNombre] = useState(receta.nombre_receta);
  const [descripcion, setDescripcion] = useState(receta.descripcion);
  const [tiempoPreparacion, setTiempoPreparacion] = useState(receta.tiempo_preparacion);
  const [numeroPorciones, setNumeroPorciones] = useState(receta.numero_porciones);
  const [dificultad, setDificultad] = useState(receta.dificultad);
  const [estado, setEstado] = useState(receta.estado);
  const [isOpenGenerador, setIsOpenGenerador] = useState(false);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    foto: '',
    imagenBase64: '',
    estado: false,
  });

  const id = localStorage.getItem('id');

  // Update form values when receta changes
  useEffect(() => {
    setNombre(receta.nombre_receta);
    setDescripcion(receta.descripcion);
    setTiempoPreparacion(receta.tiempo_preparacion);
    setNumeroPorciones(receta.numero_porciones);
    setDificultad(receta.dificultad);
    setEstado(receta.estado);
    setImage(null); // Reset image on receta change
  }, [receta]);

  // File change handler with validation
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen.');
        return;
      }
      if (file.size > 5000000) { // 5MB limit
        alert('El archivo es demasiado grande. Elige una imagen de menos de 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          imagenBase64: reader.result.split(',')[1],
        }));
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Submit handler with flexible validation (only modified fields are sent)
  const handleSubmit = async () => {
    // Crear el objeto para enviar solo los campos modificados
    const updatedData = {};

    if (nombre !== receta.nombre_receta) updatedData.nombre_receta = nombre;
    if (descripcion !== receta.descripcion) updatedData.descripcion = descripcion;
    if (tiempoPreparacion !== receta.tiempo_preparacion) updatedData.tiempo_preparacion = tiempoPreparacion;
    if (numeroPorciones !== receta.numero_porciones) updatedData.numero_porciones = numeroPorciones;
    if (dificultad !== receta.dificultad) updatedData.dificultad = dificultad;
    if (formData.imagenBase64 && formData.imagenBase64 !== receta.foto) updatedData.foto = formData.imagenBase64;
    if (estado !== receta.estado) updatedData.estado = estado;

    // Verificar si hay cambios
    if (Object.keys(updatedData).length === 0) {
      alert('No se han realizado cambios.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recetas/${receta.id_recetas}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {

        alert("Receta actualizada exitosamente");
        window.location.reload();
        const data = await response.json();
        actualizarReceta(data);
        setShowModalEditar(false);
      } else {
        const data = await response.json();
        console.error('Error al actualizar receta:', data.message);
        alert(data.message || 'Error al actualizar receta');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  return (
    <Modal show={showModalEditar} onHide={() => setShowModalEditar(false)} className="z-50">
      <Modal.Header closeButton>
        <Modal.Title>Editar {receta.nombre_receta}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formEstado">
          <Form.Label className="me-3 mb-0">Estado</Form.Label>
          <Form.Check
            type="switch"
            id="estado-switch"
            label={isOpenGenerador ? 'Subir foto desde el celular' : 'Elegir Foto'}
            checked={isOpenGenerador}
            onChange={() => setIsOpenGenerador(!isOpenGenerador)}
          />
        </Form.Group>

        {isOpenGenerador ? (
          <div className="form-group me-3 mb-0">
            <Generador_de_codigo id_producto={receta.id_recetas} id_usuario={id} route="recetas" />
          </div>
        ) : (
          <ImageUploader receta={receta} image={image} handleFileChange={handleFileChange} />
        )}

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
          <Form.Group>
            <Form.Label>Tiempo de Preparación (minutos)</Form.Label>
            <Form.Control
              type="number"
              value={tiempoPreparacion}
              onChange={(e) => setTiempoPreparacion(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Número de Porciones</Form.Label>
            <Form.Control
              type="number"
              value={numeroPorciones}
              onChange={(e) => setNumeroPorciones(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Dificultad</Form.Label>
            <Form.Control
              as="select"
              value={dificultad}
              onChange={(e) => setDificultad(e.target.value)}
            >
              <option value="Fácil">Fácil</option>
              <option value="Medio">Medio</option>
              <option value="Difícil">Difícil</option>
            </Form.Control>
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
