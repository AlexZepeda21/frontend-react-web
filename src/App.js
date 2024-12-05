import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/globals.css';


// Rutas de inicio de sesion
import Login from './login-form';
import Register from './register-form';

//Rutas de menus
import Menuadmin from './menus/Menuadmin';
import Menuuser from './menus/Menuuser';

//Rutas de categorias
import Categoria_recetas from './admin/categoria_recetas';

// Importando rutas de controles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Menuadmin />} />

        {/* Ruta de login */}
        <Route path="/loginForm" element={<Login />} />
        <Route path="/register-form" element={<Register />} />


        {/* Ruta de menu */}
        <Route path="/menus/Menuadmin" element={<Menuadmin />} />
        <Route path="/menus/Menuuser" element={<Menuuser />} />

        {/* Ruta de categorias */}
        <Route path="/admin/categoria_recetas" element={<Categoria_recetas />} />





      </Routes>
    </Router>
  );
}

export default App;
