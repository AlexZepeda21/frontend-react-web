import React, { useEffect, useState } from 'react';
import "../../styles/Menuchef/Header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const correo = localStorage.getItem("correo");

  // Función para abrir/cerrar el sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <header className="header">
      {/* Botón de hamburguesa */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <span className="hamburger">☰</span>
      </div>
      <h1 className="header-title">CAFETERÍA ITCA</h1>
      <div className="header-right">
        
      </div>
    </header>
  );
}

export default Header;