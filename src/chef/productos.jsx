import Modal from 'react-modal';

const ProductosChef = ({ isOpen, setIsOpen }) => {
  const closeModal = () => setIsOpen(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={false} // Evita cerrar al hacer clic fuera
      shouldCloseOnEsc={false} // Evita cerrar con la tecla ESC
    >
      <h2>Registro de Producto</h2>
      <form className="product-form">
        {/* Formulario */}
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" className="form-control" placeholder="Nombre del producto" />
        </div>
        <button type="button" onClick={closeModal} className="btn btn-danger">
          Cerrar
        </button>
      </form>
    </Modal>
  );
};

export default ProductosChef;
