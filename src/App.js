import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importando rutas
import Login from './login-form';
import './styles/globals.css';
import Menuadmin from './menus/Menuadmin';
import Menuuser from './menus/Menuuser';

// Importando rutas de controles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Menuadmin/>} />
        
        {/* Ruta de login */}
        <Route path="/loginForm" element={<Login />} />

        {/* Ruta de menu admin */}
        <Route path="/menus/Menuadmin" element={<Menuadmin/>} />
        <Route path="/menus/Menuuser" element={<Menuuser/>} />


      </Routes>
    </Router>
  );
}

export default App;
