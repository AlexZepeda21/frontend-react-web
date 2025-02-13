import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { API_BASE_URL } from "../url";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const Dashboard = () => {
  const [barData, setBarData] = useState(null);
  const [lineData, setLineData] = useState(null);

  useEffect(() => {
    // Función para obtener datos de la API
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/grafica_platillo_mas_reservado`);
        const result = await response.json();

        if (result.status === 200) {
          const message = result.message;

          const labels = message.map((item) => item.nombre);
          const barDataValues = message.map((item) => item.cantidad);
          const lineDataValues = message.map((item) => item.cantidad);

          setBarData({
            labels,
            datasets: [
              {
                label: "Platillos más reservados",
                data: barDataValues,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          });


        } else {
          console.error("Error en los datos de la API:", result.message);
        }
      } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    // Función para obtener datos de la API
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/grafica_productos_mas_utilizados`);
        const result = await response.json();

        if (result.status === 200) {
          const message = result.message;

          const labels = message.map((item) => item.nombre);
          const barDataValues = message.map((item) => item.cantidad);
          const lineDataValues = message.map((item) => item.cantidad);

          setLineData({
            labels,
            datasets: [
              {
                label: "Productos mas utilizados",
                data: lineDataValues,
                fill: false,
                borderColor: "rgba(255, 99, 132, 1)",
                tension: 0.4,
              },
            ],
          });


        } else {
          console.error("Error en los datos de la API:", result.message);
        }
      } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
      }
    };

    fetchData();
  }, []);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div className="container di mt-5">
      <h1 className="text-3xl titulo font-bold tracking-tight">Graficos</h1>
      <p className="titulo font-bold tracking-tight"> Estos le proporcionaran un analisis mas detenido de la gestion de sus productos y platillos</p>

      <div className="dashboard-container" style={styles.dashboardContainer}>
        {/* Gráfica de Barras */}
        <div className="chart" style={styles.chart}>
          <h3 style={styles.title}>Los 6 platillos mas reservados</h3>
          {barData ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>

        {/* Gráfica de Líneas */}
        <div className="chart" style={styles.chart}>
          <h3 style={styles.title}>Los 6 productos mas utilizados</h3>
          {lineData ? (
            <Line data={lineData} options={lineOptions} />
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    padding: "20px",
    maxWidth: "1200px",
    margin: "auto",
  },
  chart: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    height: "300px",
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
  },
};

export default Dashboard;
