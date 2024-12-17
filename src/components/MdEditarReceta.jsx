import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Generador_de_codigo from '../QR/Generador_de_codigo';

const MdEditarReceta = ({ showModalEditar, setShowModalEditar, receta }) => {
  const [nombre, setNombre] = useState(receta.nombre_receta);
  const [descripcion, setDescripcion] = useState(receta.descripcion);
    const [isOpenGenerador, setIsOpenGenerador] = useState(null);
  
    const id = localStorage.getItem('id'); // Obtener el id de usuario del localStorage
  const [image, setImage] = useState(null);


  const [formData, setFormData] = useState({
   
      foto: '',
      imagenBase64: '',
      nombre: '',
      estado: false,
    });
  

  const handleSubmit = () => {
    // Aquí realizarías la lógica para editar la receta (p. ej., llamar a la API)
    console.log("Receta editada", { nombre, descripcion });
    setShowModalEditar(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          imagenBase64: reader.result.split(',')[1],
        }));
        setImage(reader.result); // Mostrar previsualización de la imagen
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <Modal show={showModalEditar} onHide={() => setShowModalEditar(false)} className='z-50'>
      <Modal.Header closeButton>
        <Modal.Title>Editar {receta.nombre_receta}</Modal.Title>
      </Modal.Header>
      <Modal.Body>


      <Form.Group controlId="formEstado" className="">
            <Form.Label className="me-3 mb-0">Estado</Form.Label>
            <Form.Check
              type="switch"
              id="estado-switch"
              label={isOpenGenerador ? "Subir foto dede el celular" : "Elegir Foto"}
              checked={isOpenGenerador}
              onChange={() => setIsOpenGenerador(!isOpenGenerador)}
            />
            </Form.Group>

            { isOpenGenerador === true ? (
                <div className="form-group me-3 mb-0">
                 <Generador_de_codigo
                    id_producto= {receta.id_recetas}
                    id_usuario = {id}
                    route = {"recetas"}
                  />
                 </div>
              ):(
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
              )
            }

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
