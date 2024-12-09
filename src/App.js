import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/globals.css';

// Rutas de inicio de sesión
import Login from './login-form';
import Register from './register-form';

// Layout que contiene el menú de administración
import Layout from './Menus/Menuadmin';
import MainContent from './Menus/componentes/MainContent';


//eligiendo pro
import ProductoCard from './admin/eligiendo_pro';


// Rutas de categorías
import Categoria_recetas from './admin/categoria_recetas';
import Categoria_productos from './admin/categoria_productos';
import Productos from './admin/productos';


// Importando rutas de controles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de autenticación (Login/Register) */}
        <Route path="/admin" element={<Layout />} />
        <Route path="/" element={<Login />} />

        {/* Ruta principal con Layout contenedor */}
        <Route path="/" element={<MainContent />}>
          {/* Rutas que usan el Layout como contenedor */}
          <Route path="admin/categoria_recetas" element={<Categoria_recetas />} />
          <Route path="admin/categoria_productos" element={<Categoria_productos />} />
          <Route path="admin/eligiendo_pro" element={<ProductoCard />} />
          <Route path="admin/productos" element={<Productos />} />
          <Route path="/register-form" element={<Register />} />
          <Route path="/login-form" element={<Login />} />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
