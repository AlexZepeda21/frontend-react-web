import React from 'react';
import Sidebar from './componentes/Sidebar';
import Header from './componentes/Header';
import MainContent from './componentes/MainContent';
//import './App.css';
import "./../styles/Menuadmin/menu.css";
localStorage.getItem("correo");
const Layout = () => {
    return (
        <div className="app">
      <Sidebar />
      <div className="main-container">
        <Header />
        <MainContent />
      </div>
    </div>
    );
};
export default Layout;
