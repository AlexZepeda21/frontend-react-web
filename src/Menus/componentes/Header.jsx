import React, { useEffect, useState } from 'react';
import "../../styles/Menuadmin/Header.css";

function Header() {
  const correo = localStorage.getItem("correo");

 
 
  return (
    <>
   
    
    <header className="header">
      
      <h1 className="header-title">CAFETERÍA ITCA</h1>
      <div className="header-right">
        
      </div>
    </header>
    </>
  );
}

export default Header;

