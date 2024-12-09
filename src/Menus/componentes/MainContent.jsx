import React from 'react';
//import './MainContent.css';
import "../../styles/Menuadmin/MainContent.css";
import { Outlet } from 'react-router-dom';
function MainContent() {
  return (
    <main className="main-content">
      <div className="content-container">
        <Outlet />
      </div>
    </main>
  );
}

export default MainContent;

