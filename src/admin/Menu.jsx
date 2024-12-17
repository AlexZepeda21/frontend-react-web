import React from 'react';
import '../styles/menu.css'; // Asegúrate de que existe tu archivo CSS

const Menu = () => {
  const menuItems = [
    {
      id: 1,
      name: 'Latte',
      description: 'Café espresso con leche cremosa',
      price: '$3.50',
      image: 'https://via.placeholder.com/300?text=Latte'
    },
    {
      id: 2,
      name: 'Cappuccino',
      description: 'Espresso con espuma de leche',
      price: '$3.00',
      image: 'https://via.placeholder.com/300?text=Cappuccino'
    },
    {
      id: 3,
      name: 'Americano',
      description: 'Espresso diluido con agua caliente',
      price: '$2.50',
      image: 'https://via.placeholder.com/300?text=Americano'
    },
    {
      id: 4,
      name: 'Muffin de Chocolate',
      description: 'Esponjoso y con chispas de chocolate',
      price: '$2.00',
      image: 'https://via.placeholder.com/300?text=Muffin+de+Chocolate'
    },
    {
      id: 5,
      name: 'Croissant',
      description: 'Hojaldre crujiente y mantequilloso',
      price: '$2.50',
      image: 'https://via.placeholder.com/300?text=Croissant'
    },
  ];

  return (
    <div className="menu-container">
      <h1 className="menu-title">Menú de la Cafetería</h1>
      <div className="menu-grid">
        {menuItems.map(item => (
          <div key={item.id} className="menu-card">
            <img src={item.image} alt={item.name} className="menu-item-image" />
            <h2 className="menu-item-name">{item.name}</h2>
            <p className="menu-item-description">{item.description}</p>
            <p className="menu-item-price">{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;