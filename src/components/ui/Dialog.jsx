import React from 'react';

// Componente de Modal (Dialog)
export const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <div className={`dialog-overlay ${open ? 'open' : ''}`} onClick={() => onOpenChange(false)}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// Componente de DialogTrigger
export const DialogTrigger = ({ children, onClick }) => {
  return (
    <button className="dialog-trigger" onClick={onClick}>
      {children}
    </button>
  );
};

// Componente de DialogContent
export const DialogContent = ({ children }) => {
  return <div className="dialog-inner-content">{children}</div>;
};

// Componente de DialogTitle
export const DialogTitle = ({ children }) => {
  return <h2 className="dialog-title">{children}</h2>;
};

// Componente de DialogDescription
export const DialogDescription = ({ children }) => {
  return <p className="dialog-description">{children}</p>;
};

// Componente de DialogFooter
export const DialogFooter = ({ children }) => {
  return <div className="dialog-footer">{children}</div>;
};

// Estilos básicos para el Modal (puedes personalizarlos)
const styles = `
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
  }
  
  .dialog-overlay.open {
    opacity: 1;
    visibility: visible;
  }

  .dialog-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
    position: relative;
  }

  .dialog-title {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .dialog-description {
    font-size: 1rem;
    margin-bottom: 20px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }

  .dialog-trigger {
    background: #4CAF50;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  .dialog-trigger:hover {
    background: #45a049;
  }

  .dialog-inner-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export default Dialog;
