import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Importando rutas
import Login from './login-form';
import './styles/globals.css'


// Importando rutas de controles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Login />} />
        
        {/* Ruta de login */}
        <Route path="/loginForm" element={<Login />} />


      </Routes>
    </Router>
  );
}

export default App;
