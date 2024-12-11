import React from 'react';
//import './Header.css';
import "../../styles/Menuadmin/Header.css";

function Header() {

  const correo = localStorage.getItem("correo");

  return (
    <header className="header">
      <h1 className="header-title">CAFETERÍA ITCA</h1>
      <div className="header-right">
        <div className="search-container">
          <input type="text" placeholder="Buscar..." className="search-input" />
          <i className="icon-search"></i>
        </div>
        <div className="user-info">
          <span className="user-name">{correo}</span>
          <img src="/avatar.png" alt="User Avatar" className="user-avatar" />
        </div>
      </div>
    </header>
  );
}

export default Header;

