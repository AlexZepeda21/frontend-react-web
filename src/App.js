import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/globals.css';

// Rutas de inicio de sesión
import Login from './login-form';
import Register from './register-form';

// Layout que contiene el menú de administración
import Layout from './layout/Menuadmin';

// Rutas de categorías
import Categoria_recetas from './admin/categoria_recetas';

// Importando rutas de controles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de autenticación (Login/Register) */}
        <Route path="/layout/Menuadmin" element={<Layout />} />
        <Route path="/" element={<Login />} />

        {/* Ruta principal con Layout contenedor */}
        <Route path="/" element={<Layout />}>
          {/* Rutas que usan el Layout como contenedor */}
          <Route path="admin/categoria_recetas" element={<Categoria_recetas />} />
          <Route path="/register-form" element={<Register />} />
          <Route path="/login-form" element={<Login />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
