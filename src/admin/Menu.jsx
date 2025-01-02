import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../url';  // Asegúrate de configurar esta URL correctamente
import 'bootstrap/dist/css/bootstrap.min.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para cargar los menús desde la API
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/menu`); // Cambia la URL a tu API real
      setMenuItems(response.data); // Almacena los menús en el estado
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los menús');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  if (loading) return <div className="text-center">Cargando menús...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="container py-5">
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {menuItems.map(item => (
          <div key={item.id} className="col">
            <div className="card shadow-sm border-light rounded-3">
              {/* Ajuste en la imagen */}
              <img
                src={item.img ? `data:image/jpeg;base64,${item.img}` : "https://via.placeholder.com/300"}
                alt={item.nombre}
                className="card-img-top rounded-top"
                style={{
                  objectFit: 'cover', // Asegura que la imagen cubra el espacio sin distorsionarse
                  maxHeight: '150px', // Limita la altura de la imagen (más pequeña)
                  height: '150px',    // Altura fija de la imagen
                  width: '100%',      // Asegura que la imagen se ajuste al ancho
                }}
              />
              <div className="card-body">
                <h5 className="card-title">{item.nombre}</h5>
                <p className="card-text">{item.descripcion}</p>
                <p className="card-text"><strong>Precio:</strong> ${item.precio}</p>
                <p className="card-text"><strong>Cantidad disponible:</strong> {item.cantidad_platos}</p>
                <p className={`badge ${item.estado ? "bg-success" : "bg-danger"}`}>
                  {item.estado ? "Disponible" : "No disponible"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
