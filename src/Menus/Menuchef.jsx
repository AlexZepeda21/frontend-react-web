import React from 'react';
import Sidebar from './componentsChef/Sidebar';
import Header from './componentsChef/Header';
import MainContent from './componentsChef/MainContent';
//import './App.css';
import "./../styles/Menuchef/menu.css";
localStorage.getItem("correo");
const LayoutChef = () => {
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
export default LayoutChef;
